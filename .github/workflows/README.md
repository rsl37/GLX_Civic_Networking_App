# GitHub Actions Workflows Documentation - STREAMLINED

This repository implements a **12-workflow architecture** designed using Ashby's Law of Requisite Variety to balance complexity with maintainability while ensuring 100% code integrity.

## 🚀 Streamlining Summary

**BEFORE**: 25 overlapping workflows with redundant checks  
**AFTER**: 12 purpose-driven workflows organized in 3 tiers  
**PRINCIPLE**: Right-sized variety that matches repository complexity without fragmentation

## Workflow Architecture (3 Tiers)

### Tier 1: Core Pipeline Workflows (4 workflows)

These are essential workflows that maintain code and deployment integrity.

#### 1. **CI/CD Pipeline** - `ci-pipeline.yml`
**Purpose**: Unified build, test, quality, and deployment readiness  
**Jobs**: Build & Test, Code Quality, Security Quick Scan, Deployment Check  
**Triggers**: Push to main/develop, Pull Requests, Manual dispatch

#### 2. **Security Scan** - `security-scan.yml`
**Purpose**: Comprehensive security vulnerability detection  
**Jobs**: CodeQL Analysis, Dependency Scan, Secret Detection, njsscan  
**Triggers**: Push to main/develop, Pull Requests, Daily schedule (2 AM UTC)

#### 3. **Deploy** - `deploy.yml`
**Purpose**: Preview and production deployments  
**Jobs**: Build, Preview Deploy (PRs), Production Deploy (manual)  
**Triggers**: Pull Requests, Manual dispatch for production

#### 4. **Quality Gate** - `quality-gate.yml`
**Purpose**: Quality metrics, performance, accessibility, E2E testing  
**Jobs**: Code Coverage, Accessibility, Performance, E2E Tests  
**Triggers**: Push to main, Pull Requests, Weekly schedule

### Tier 2: Specialized Workflows (4 workflows)

Domain-specific workflows for specialized concerns.

#### 5. **Web3 Validation** - `web3-checks.yml`
**Purpose**: Web3/blockchain functionality and security validation  
**Triggers**: Changes to web3/crypto/blockchain files

#### 6. **License Compliance** - `license-compliance.yml`
**Purpose**: Ensure license compatibility  
**Triggers**: Weekly schedule, dependency changes

#### 7. **Service Connectivity** - `service-connectivity-checks.yml`
**Purpose**: External service integration health  
**Triggers**: Daily schedule, service config changes

#### 8. **PAT Security** - `pat-security.yml`
**Purpose**: PAT token security and validation  
**Triggers**: Every 6 hours, PAT workflow changes

### Tier 3: Utility & Maintenance Workflows (4 workflows)

Lightweight workflows for repository housekeeping.

#### 9. **Documentation** - `documentation-validation.yml`
**Purpose**: Documentation freshness and quality  
**Triggers**: Monthly schedule, markdown changes

#### 10. **Stale Issues** - `stale.yml`
**Purpose**: Issue and PR lifecycle management  
**Triggers**: Daily schedule

#### 11. **Submodule Access** - `secure-submodule-access.yml`
**Purpose**: Secure submodule operations  
**Triggers**: Changes to .gitmodules, Core/

#### 12. **Copilot Setup** - `copilot-setup.yml`
**Purpose**: MCP configuration for Copilot  
**Triggers**: Manual dispatch only

---

## Deprecated Workflows (To Be Removed)

The following workflows are superseded by the consolidated architecture:

| Deprecated Workflow | Replaced By |
|---------------------|-------------|
| `main.yml` | `ci-pipeline.yml` |
| `comprehensive-checks.yml` | `ci-pipeline.yml` |
| `quality.yml` | `quality-gate.yml` |
| `codeql.yml` | `security-scan.yml` |
| `njsscan.yml` | `security-scan.yml` |
| `security-streamlined.yml` | `security-scan.yml` |
| `release.yml` | `deploy.yml` |
| `preview-deploy.yml` | `deploy.yml` |
| `vercel-integration-check.yml` | `deploy.yml` |
| `pat-security-monitoring.yml` | `pat-security.yml` |
| `pat-implementation-validation.yml` | `pat-security.yml` |
| `secure-pat-checkout.yml` | `pat-security.yml` |
| `cross-repo-pat-operations.yml` | `secure-submodule-access.yml` |
| `workflow-dispatcher.yml` | Path filters in workflows |
| `workflow-monitor.yml` | GitHub built-in monitoring |
| `status-monitor.yml` | GitHub built-in monitoring |
| `health-location-status.yml` | `ci-pipeline.yml` |
| `summary.yml` | Removed (was disabled) |

---

## 🔧 Key Improvements

### Variety Engineering (Ashby's Law Applied)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Workflows | 25 | 12 | 52% reduction |
| Redundant CI Paths | 4+ | 1 | Single source of truth |
| Security Checks | 5+ overlapping | 1 comprehensive | Consolidated |
| Deployment Paths | 3 overlapping | 1 unified | Clear process |
| Maintenance Burden | High | Low | Easy to maintain |

### Reliability Enhancements

- 🛡️ **Timeout Protection**: Job-level (10-20min), Step-level (3-8min)
- 🛡️ **Fail-fast: false**: Prevents early matrix cancellation
- 🛡️ **Path Filtering**: Workflows only run on relevant changes
- 🛡️ **Graceful Fallbacks**: PAT_TOKEN → GITHUB_TOKEN fallback

### Performance Optimizations

- 📈 **Reduced workflow count**: 25 → 12 (52% reduction)
- 📈 **Efficient caching**: npm cache with version keys
- 📈 **Shallow clones**: `fetch-depth: 1` for speed
- 📈 **Conditional execution**: Skip docs-only changes

## 📊 Required Status Checks

### For `main` Branch Protection

Configure these status checks in **Settings → Branches → Branch Protection Rules**:

**Required (Core Pipeline):**
1. `CI/CD Pipeline / Build and Test`
2. `CI/CD Pipeline / Code Quality`
3. `CI/CD Pipeline / Security Quick Scan`
4. `Security Scan / Dependency Security`

**Recommended:**
5. `Quality Gate / E2E Tests`
6. `Deploy / Preview Deployment`
7. `Security Scan / CodeQL Analysis`

### Status Check Mapping

| Old Check Name | New Check Name |
|----------------|----------------|
| Build and Test | CI/CD Pipeline / Build and Test |
| Code Quality | CI/CD Pipeline / Code Quality |
| Security Check | CI/CD Pipeline / Security Quick Scan |
| Deployment Readiness | CI/CD Pipeline / Deployment Readiness |
| Security Analysis | Security Scan / Security Summary |
| Code Coverage | Quality Gate / Code Coverage |
| E2E Tests | Quality Gate / E2E Tests |

## 🔧 Troubleshooting

**If workflows still hang or stall:**
1. Check Node.js version compatibility (must be 20.x+ for dependencies)
2. Verify timeout values are appropriate for your system
3. Review process cleanup in deployment workflows
4. Check for network connectivity issues in health checks

**Common fixes applied:**
- Removed Node 18.x compatibility (package engine requirements)
- Added `fail-fast: false` to prevent early matrix cancellation
- Implemented comprehensive timeout protection
- Optimized dependency installation with offline-first approach

## Security Configuration

### Dependabot - `.github/dependabot.yml`
- **Weekly dependency updates** (Mondays at 4 AM UTC)
- **Grouped updates** for production vs development dependencies
- **Security updates** for all dependency types
- **GitHub Actions updates** to keep workflows current

### CodeQL Configuration - `.github/codeql-config.yml`
- **Security and quality queries** enabled
- **Path filtering** to focus on source code
- **Exclusions** for build artifacts and test files

## Branch Protection Configuration

To implement the full status check system, configure the following branch protection rules:

### Main Branch Protection

Navigate to **Settings → Branches → Add Rule** for the `main` branch:

#### Required Status Checks
Enable "Require status checks to pass before merging" and select:

**CI Checks:**
- Build Application (ubuntu-latest, 18.x)
- Build Application (ubuntu-latest, 20.x)
- TypeScript Type Check

**Code Quality:**
- Lint and Format Check
- Code Coverage

**Security:**
- Dependency Vulnerability Scan
- CodeQL Security Analysis / javascript
- Secret Scanning

**Testing:**
- Unit Tests (ubuntu-latest, 18.x)
- Unit Tests (ubuntu-latest, 20.x)
- Integration Tests
- End-to-End Tests

**Performance:**
- Performance Benchmarks
- Memory Performance Tests

**Application-Specific:**
- Database Migration Tests
- API Contract Tests
- Socket.IO Tests
- Web3 Integration Tests

**Deployment:**
- Staging Deployment Verification
- Deployment Health Checks
- Environment Compatibility (ubuntu-latest, 18.x)
- Environment Compatibility (ubuntu-latest, 20.x)
- Environment Compatibility (ubuntu-latest, 22.x)

#### Additional Protection Settings
- ✅ Require branches to be up to date before merging
- ✅ Require pull request reviews before merging (minimum 1)
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require review from code owners
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require signed commits (recommended)

### Develop Branch Protection

Similar configuration with slightly relaxed requirements:
- All status checks required
- Pull request reviews optional for development
- Allow force pushes for maintainers

## Workflow Customization

### Environment Variables
Set these repository secrets for full functionality:

```bash
# Required for deployment testing
STAGING_URL=https://staging.glx.app

# Optional for enhanced reporting
CODECOV_TOKEN=your_codecov_token
LIGHTHOUSE_CI_TOKEN=your_lhci_token
```

### Performance Budgets
Current thresholds in `performance.yml`:
- JavaScript bundle: < 1MB
- CSS bundle: < 100KB
- Lighthouse scores: Performance > 70%, Accessibility > 90%

### Test Framework Support
Workflows auto-detect and support:
- **Vitest** (preferred for Vite projects)
- **Jest** (fallback)
- **Playwright** (E2E testing)
- **Supertest** (API testing)

## Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check security alert notifications
- Monitor performance trends

### Monthly Tasks
- Review and update performance budgets
- Audit workflow efficiency
- Update test coverage requirements

### Troubleshooting

**Common Issues:**

1. **Build Failures**: Check Node.js version compatibility
2. **Test Timeouts**: Increase timeout values in workflow files
3. **Permission Errors**: Verify repository permissions for GitHub Actions
4. **Large Bundle Warnings**: Implement code splitting

**Debug Commands:**
```bash
# Local testing commands
npm run build
npm run test
npm audit
npx lighthouse http://localhost:3000
```

## Contributing

When adding new workflows:
1. Follow existing naming conventions
2. Include proper error handling
3. Add documentation updates
4. Test locally before committing
5. Use semantic commit messages

## Status Badge Integration

Add these badges to your README.md:

```markdown
![CI](https://github.com/rsl37/GLX_App/workflows/Continuous%20Integration/badge.svg)
![Security](https://github.com/rsl37/GLX_App/workflows/Security%20Checks/badge.svg)
![Tests](https://github.com/rsl37/GLX_App/workflows/Testing/badge.svg)
```