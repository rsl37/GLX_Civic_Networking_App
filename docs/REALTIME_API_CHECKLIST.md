# Recommended Hybrid Communication and Dispatch Architecture

This document summarizes the recommended hybrid communication and dispatch architecture that integrates various technologies to enhance crisis management and communication. The architecture consists of the following components:

1. **Crisis/Incident Dispatch and Status Management**: Managed by **Resgrid**.
2. **Chat, Messaging, and Notifications**: Handled by **Socket.io** (local/self-hosted) for real-time communication, and/or **Ably/Firebase** for scalable, cloud, and global implementation.
3. **SMS/Voice Features**: Integrated through **Twilio** or **Vonage** for effective communication during crises.

---

# Real-time API Checklist

## Implementation Status

- [x] **Crisis/Incident Dispatch**: Resgrid integration complete (`server/communications/resgrid.ts`)
- [x] **Chat Feature**: Socket.io provider implemented (`server/communications/socketio.ts`)
- [x] **Messaging Notifications**: Ably/Firebase scaffold ready (`server/communications/globalMessaging.ts`)
- [x] **SMS Integration**: Twilio SMS implemented (`server/communications/twilio.ts`)
- [x] **Voice Communication**: Twilio voice calls implemented (`server/communications/twilio.ts`)
- [x] **Communication Manager**: Unified interface created (`server/communications/index.ts`)
- [x] **API Routes**: REST endpoints implemented (`server/routes/communications.ts`)
- [x] **Tests**: Comprehensive test suite (`tests/communications/`)

---

## API Endpoints Reference

### Health & Configuration
- `GET /api/communications/health` - Provider health status
- `GET /api/communications/config` - Configuration (auth required)

### Incident Management (Resgrid)
- `POST /api/communications/incidents` - Create incident
- `GET /api/communications/incidents` - List incidents
- `GET /api/communications/incidents/:id` - Get incident
- `PATCH /api/communications/incidents/:id` - Update incident
- `POST /api/communications/incidents/:id/dispatch` - Dispatch units

### Unit Management
- `GET /api/communications/units` - List units
- `PATCH /api/communications/units/:id/status` - Update unit status

### Escalation (Twilio)
- `POST /api/communications/escalate/sms` - Send SMS
- `POST /api/communications/escalate/voice` - Initiate voice call
- `POST /api/communications/escalate/broadcast` - Bulk SMS

### Webhooks
- `POST /api/communications/webhooks/resgrid` - Resgrid events
- `POST /api/communications/webhooks/twilio` - Twilio status updates

---

## Environment Variables

```bash
# Provider Selection
COMM_DEFAULT_PROVIDER=pusher

# Resgrid
RESGRID_API_KEY=
RESGRID_API_URL=https://api.resgrid.com/api/v1
RESGRID_DEPARTMENT_ID=

# Socket.io
SOCKETIO_ENABLED=false
SOCKETIO_PATH=/socket.io

# Ably (scaffold)
ABLY_API_KEY=

# Firebase (scaffold)
FIREBASE_PROJECT_ID=

# Twilio
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Escalation
ESCALATION_ENABLE_SMS=true
ESCALATION_ENABLE_VOICE=true
ESCALATION_PRIORITY_THRESHOLD=high
```

---

## Next Steps

1. Configure Resgrid account and department
2. Set up Twilio account for SMS/voice
3. Deploy and test in staging environment
4. Implement Ably or Firebase when scaling globally
