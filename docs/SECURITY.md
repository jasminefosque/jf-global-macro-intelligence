# Security Documentation

This document outlines the security considerations and best practices for the Global Macro Intelligence dashboard.

## Security Principles

This portfolio repository adheres to strict security principles:

1. **No Secrets in Code**: No API keys, tokens, or credentials are committed to the repository
2. **No Production Systems**: No references to production databases, endpoints, or infrastructure
3. **No Proprietary Data**: No confidential or commercially sensitive datasets
4. **Defense in Depth**: Multiple layers of protection
5. **Transparency**: Clear documentation of security measures

## What's NOT in This Repository

### ❌ API Keys and Credentials
- No API keys for paid data services
- No database passwords
- No OAuth tokens
- No service account credentials
- No encryption keys

### ❌ Production Configuration
- No production database URLs
- No Supabase project references
- No production API endpoints
- No internal service URLs
- No VPN or network configurations

### ❌ Proprietary Data
- No datasets from paid data vendors (Bloomberg, Refinitiv, etc.)
- No internal company data
- No customer information
- No trading algorithms or strategies
- No proprietary financial models

## Environment Variables

### Local Development (.env)
```bash
# Safe for local development
VITE_DATA_MODE=synthetic
```

### Production Deployment
When deploying, set environment variables through your hosting platform's secure configuration:

**Vercel**:
```bash
vercel env add VITE_DATA_MODE
```

**Netlify**:
```bash
netlify env:set VITE_DATA_MODE synthetic
```

### Optional Open Data Mode
If connecting to open data sources that require authentication:

```bash
# Add to .env.local (NOT committed)
VITE_OPEN_DATA_API_KEY=your_free_api_key_here
```

**Important**: Never commit `.env.local` or any file containing real keys.

## Git Ignore Configuration

The `.gitignore` file explicitly excludes:

```
# Environment files
.env
.env.local
.env.*.local

# Build artifacts
dist
dist-ssr
node_modules

# IDE files
.vscode/*
.idea
```

**Always verify** that sensitive files are in `.gitignore` before committing.

## Data Security

### Synthetic Mode (Default)
- All data is generated locally
- No external API calls
- No data transmission
- No privacy concerns
- Safe for public demonstration

### Open Mode (When Implemented)
When connecting to real data sources:

1. **Use HTTPS Only**: All API calls must use secure connections
2. **Validate Inputs**: Sanitize all user inputs before API calls
3. **Rate Limiting**: Implement client-side rate limiting to prevent abuse
4. **Error Handling**: Don't expose stack traces or internal errors to users
5. **CORS Policy**: Respect Cross-Origin Resource Sharing restrictions

## Frontend Security

### XSS Prevention
- React escapes all rendered content by default
- No use of `dangerouslySetInnerHTML`
- All user inputs are controlled components
- Chart tooltips use safe rendering

### CSRF Protection
- No authentication in this demo
- Stateless application
- No session management
- No cookies

### Dependency Security

Regular security audits:
```bash
npm audit
npm audit fix
```

Current known vulnerabilities: None critical (as of initial commit)

**Note**: Some dev dependencies may have moderate vulnerabilities. These don't affect the production build.

## Code Security

### TypeScript Strict Mode
Enabled in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Zod Schema Validation
All external data is validated:
```typescript
const TimeSeries = TimeSeriesSchema.parse(data);
```

This prevents:
- Type confusion
- Injection attacks
- Unexpected data structures
- Runtime errors

### Error Boundaries
Prevent application crashes from exposing sensitive information:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Recommended Practices for Real Deployment

When adapting this for production use with real data:

### 1. API Key Management
**Don't**:
- Hard-code keys in source files
- Commit keys to version control
- Share keys via insecure channels
- Use production keys in development

**Do**:
- Use environment variables
- Rotate keys regularly
- Use separate keys for dev/staging/prod
- Store keys in secure vaults (AWS Secrets Manager, Azure Key Vault)

### 2. Authentication
If adding user authentication:
- Use established libraries (Auth0, Firebase Auth, Supabase Auth)
- Implement proper session management
- Use HTTP-only cookies for tokens
- Implement CSRF protection
- Use secure password hashing (bcrypt, Argon2)

### 3. Authorization
- Implement role-based access control (RBAC)
- Verify permissions on every request
- Use least-privilege principle
- Audit access logs

### 4. Data Handling
- Encrypt sensitive data at rest
- Use TLS 1.3 for data in transit
- Implement data retention policies
- Follow GDPR/privacy regulations
- Log data access for compliance

### 5. Infrastructure
- Use WAF (Web Application Firewall)
- Enable DDoS protection
- Implement rate limiting
- Use CDN with security features
- Regular security updates

### 6. Monitoring
- Log security events
- Monitor for suspicious activity
- Set up alerts for anomalies
- Regular penetration testing
- Vulnerability scanning

## Incident Response

If you discover a security issue:

1. **Do not** open a public issue
2. Contact the repository owner directly
3. Provide detailed information
4. Allow time for fix before disclosure

## Compliance

### GDPR (if handling EU user data)
- No personal data in this demo
- If adding: implement data subject rights
- Privacy policy required
- Cookie consent required

### SOC 2 (if enterprise use)
- Audit logging
- Access controls
- Change management
- Incident response plan

## Security Checklist for Deployment

Before deploying to production:

- [ ] All environment variables moved to secure configuration
- [ ] No secrets in code
- [ ] Dependencies updated and audited
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Error messages sanitized
- [ ] Input validation on all user inputs
- [ ] Rate limiting implemented
- [ ] Monitoring and logging enabled
- [ ] Backup and recovery plan
- [ ] Security review completed

## Third-Party Dependencies

Current security-relevant dependencies:

| Package | Purpose | Security Notes |
|---------|---------|----------------|
| react | UI framework | Maintained by Meta, good track record |
| vite | Build tool | Fast-moving, stay updated |
| recharts | Charts | Regular updates, minimal vulnerabilities |
| zustand | State management | Small surface area, well-maintained |
| zod | Validation | Security-focused, type-safe |
| html2canvas | Export | Runs client-side only |

**Recommendation**: Update dependencies monthly.

## Reporting Vulnerabilities

Found a vulnerability? Please report responsibly:

1. Email: [maintainer email - replace in production]
2. Provide: Description, steps to reproduce, impact assessment
3. Allow: 90 days for fix before public disclosure
4. Recognition: Security researchers will be credited

## License and Liability

This software is provided "as is" under the MIT License. See [LICENSE](../LICENSE) for full details.

**No warranty**: Use at your own risk for demonstration purposes only.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Google Security Best Practices](https://developers.google.com/web/fundamentals/security)

## Conclusion

This repository demonstrates security-conscious development:
- No secrets exposed
- No production systems referenced
- Best practices followed
- Clear documentation

When adapting for production use, implement all recommended security measures appropriate for your threat model and compliance requirements.

---

**Last Updated**: 2026-02-18  
**Version**: 1.0.0
