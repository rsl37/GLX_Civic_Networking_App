/*
 * Copyright (c) 2025 GALAX Civic Networking App
 * 
 * This software is licensed under the PolyForm Shield License 1.0.0.
 * For the full license text, see LICENSE file in the root directory 
 * or visit https://polyformproject.org/licenses/shield/1.0.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface ConnectionHealthStatus {
  connected: boolean;
  authenticated: boolean;
  retryAttempts: number;
  maxRetries: number;
  lastError: string | null;
  connectionTime: number | null;
  pollingInterval: number;
}

interface Message {
  id: string;
  content: string;
  userId: number;
  username: string;
  timestamp: string;
  type: 'chat' | 'system';
}

interface NotificationData {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

// HTTP-based polling system to replace WebSocket functionality
export function useSocket(token: string | null) {
  const [health, setHealth] = useState<ConnectionHealthStatus>({
    connected: false,
    authenticated: false,
    retryAttempts: 0,
    maxRetries: 5,
    lastError: null,
    connectionTime: null,
    pollingInterval: 5000
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastMessageTimestamp = useRef<string | null>(null);
  const lastNotificationTimestamp = useRef<string | null>(null);
  const connectionStartTime = useRef<number>(0);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';

  useEffect(() => {
    if (!token) {
      cleanup();
      return;
    }

    initializeConnection();

    return () => {
      cleanup();
    };
  }, [token]);

  const initializeConnection = () => {
    connectionStartTime.current = Date.now();
    console.log('🔌 Initializing HTTP polling connection...');
    
    setHealth(prev => ({
      ...prev,
      connected: true,
      authenticated: true,
      lastError: null,
      connectionTime: Date.now() - connectionStartTime.current,
      retryAttempts: 0
    }));

    startPolling();
  };

  const startPolling = () => {
    stopPolling();
    
    const poll = async () => {
      try {
        await Promise.all([
          pollMessages(),
          pollNotifications()
        ]);
        
        setHealth(prev => ({
          ...prev,
          connected: true,
          lastError: null,
          retryAttempts: 0
        }));
        
      } catch (error) {
        console.error('❌ Polling error:', error);
        setHealth(prev => ({
          ...prev,
          connected: false,
          lastError: error instanceof Error ? error.message : 'Polling failed'
        }));
        
        handleReconnection();
      }
    };

    // Initial poll
    poll();
    
    // Set up regular polling
    pollingIntervalRef.current = setInterval(poll, health.pollingInterval);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
  };

  const pollMessages = async () => {
    const response = await fetch(`${baseUrl}/chat/messages?since=${lastMessageTimestamp.current || ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.messages && data.messages.length > 0) {
      setMessages(prev => {
        // Merge new messages, avoiding duplicates
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = data.messages.filter((msg: Message) => !existingIds.has(msg.id));
        return [...prev, ...newMessages];
      });
      
      // Update timestamp for next poll
      lastMessageTimestamp.current = data.messages[data.messages.length - 1].timestamp;
    }
  };

  const pollNotifications = async () => {
    const response = await fetch(`${baseUrl}/notifications?since=${lastNotificationTimestamp.current || ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.notifications && data.notifications.length > 0) {
      setNotifications(prev => {
        // Keep only last 50 notifications
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifications = data.notifications.filter((notif: NotificationData) => !existingIds.has(notif.id));
        return [...prev, ...newNotifications].slice(-50);
      });
      
      // Update timestamp for next poll
      lastNotificationTimestamp.current = data.notifications[data.notifications.length - 1].timestamp;
    }
  };

  const sendMessage = useCallback(async (content: string, roomId?: string) => {
    try {
      const response = await fetch(`${baseUrl}/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, roomId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Message sent:', data.messageId);
      
      // Trigger immediate poll to get the new message
      setTimeout(() => pollMessages().catch(console.error), 100);
      
      return data;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }, [token, baseUrl]);

  const joinRoom = useCallback(async (roomId: string) => {
    try {
      const response = await fetch(`${baseUrl}/chat/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('🏠 Joined room:', roomId);
      
      // Reset message timestamp to get all messages from this room
      lastMessageTimestamp.current = null;
      setMessages([]);
      
      // Trigger immediate poll
      setTimeout(() => pollMessages().catch(console.error), 100);
      
    } catch (error) {
      console.error('❌ Failed to join room:', error);
      throw error;
    }
  }, [token, baseUrl]);

  const leaveRoom = useCallback(async (roomId: string) => {
    try {
      const response = await fetch(`${baseUrl}/chat/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('🚪 Left room:', roomId);
      
    } catch (error) {
      console.error('❌ Failed to leave room:', error);
      throw error;
    }
  }, [token, baseUrl]);

  const handleReconnection = () => {
    if (retryTimeoutRef.current) {
      return; // Already attempting reconnection
    }

    setHealth(prev => {
      const newRetryAttempts = prev.retryAttempts + 1;
      
      if (newRetryAttempts >= prev.maxRetries) {
        console.error('❌ Maximum reconnection attempts reached');
        return {
          ...prev,
          retryAttempts: newRetryAttempts,
          lastError: 'Maximum reconnection attempts reached'
        };
      }

      // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      const delay = Math.min(2000 * Math.pow(2, newRetryAttempts - 1), 32000);
      
      console.log(`🔄 Scheduling reconnection attempt ${newRetryAttempts}/${prev.maxRetries} in ${delay}ms`);
      
      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = undefined;
        startPolling();
      }, delay);

      return {
        ...prev,
        retryAttempts: newRetryAttempts,
        lastError: `Reconnecting in ${delay}ms (attempt ${newRetryAttempts}/${prev.maxRetries})`
      };
    });
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up HTTP polling connection...');
    
    // Clear timeouts and intervals
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = undefined;
    }
    
    stopPolling();
    
    // Reset state
    setHealth({
      connected: false,
      authenticated: false,
      retryAttempts: 0,
      maxRetries: 5,
      lastError: null,
      connectionTime: null,
      pollingInterval: 5000
    });
    
    setMessages([]);
    setNotifications([]);
    lastMessageTimestamp.current = null;
    lastNotificationTimestamp.current = null;
  };

  const forceReconnect = () => {
    console.log('🔄 Forcing reconnection...');
    
    setHealth(prev => ({
      ...prev,
      retryAttempts: 0,
      lastError: null
    }));
    
    cleanup();
    
    if (token) {
      setTimeout(() => {
        initializeConnection();
      }, 1000);
    }
  };

  const getConnectionHealth = () => health;

  // Simulate socket-like interface for backward compatibility
  const socketLikeInterface = {
    connected: health.connected,
    emit: (event: string, data?: any) => {
      if (event === 'send_message') {
        return sendMessage(data.content, data.roomId);
      } else if (event === 'join_room') {
        return joinRoom(data.roomId);
      } else if (event === 'leave_room') {
        return leaveRoom(data.roomId);
      }
    },
    on: (event: string, callback: (data: any) => void) => {
      // For backward compatibility, we'll handle these events differently
      console.log(`Event listener registered for: ${event}`);
    },
    off: (event: string, callback?: (data: any) => void) => {
      console.log(`Event listener removed for: ${event}`);
    },
  };

  return {
    socket: socketLikeInterface,
    health,
    messages,
    notifications,
    sendMessage,
    joinRoom,
    leaveRoom,
    forceReconnect,
    getConnectionHealth,
    cleanup
  };
}
