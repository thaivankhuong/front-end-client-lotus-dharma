# LotusDharma - Troubleshooting Guide

## Phase 2: API Client Layer Issues

### ❌ Environment validation failed

**Problem**: "Invalid environment configuration" error on startup

**Solutions**:

1. **Generate secure secrets**:
   ```bash
   npm run generate-secrets
   # Copy the generated secrets to .env.local
   ```

2. **Check .env.local file**:
   ```bash
   # Required variables:
   NEXT_PUBLIC_JWT_SECRET=<64-char hex string>
   CSRF_SECRET=<64-char hex string>
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Verify secrets format**:
   ```bash
   # JWT secret must be at least 32 characters
   # CSRF secret must be at least 32 characters
   # Use only hex characters (0-9, a-f)
   ```

4. **Manual secret generation**:
   ```bash
   # Generate JWT secret (64+ chars):
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

   # Generate CSRF secret (64+ chars):
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

5. **Test environment loading**:
   ```bash
   npm run test-env
   # This will verify .env.local is loaded correctly
   ```

6. **Debug environment validation**:
   ```bash
   npm run debug-env
   # Shows detailed validation errors
   ```

### ❌ npm install fails with ERESOLVE errors

**Problem**: Dependency conflicts, especially with React/Next.js versions

**Solutions**:

1. **Use setup script** (recommended):
   ```bash
   npm run setup
   # This handles all dependency conflicts automatically
   ```

2. **Manual clean install**:
   ```bash
   # Remove all node modules and locks
   rm -rf node_modules package-lock.json .next

   # Install with legacy peer deps (handles most conflicts)
   npm install --legacy-peer-deps
   ```

3. **Force install** (if legacy-peer-deps not enough):
   ```bash
   npm run setup:force
   # Or manually: npm install --legacy-peer-deps --force
   ```

4. **Check versions**:
   ```bash
   node --version  # Should be 18+ (current: v24.11.1 - OK)
   npm --version   # Should be 8+
   ```

5. **Specific version conflicts**:
   - **React 18 vs 19**: We use React 18 for compatibility
   - **Next.js 15**: Stable version with full ecosystem support
   - **react-leaflet**: Downgraded to v4.2.1 for React 18 support

6. **Alternative package manager**:
   ```bash
   # Use yarn if npm fails
   rm -rf node_modules package-lock.json
   yarn install
   ```

### ❌ TypeScript compilation errors

**Problem**: `.next` folder has cached type definitions referencing deleted files

**Solution**:
```bash
# Clean Next.js cache
npm run clean:next

# Then type check
npm run type-check
```

### ❌ API routes not working

**Problem**: BFF routes return 500 errors

**Solutions**:

1. **Check environment variables**:
   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_JWT_SECRET=your-secret-here
   ```

2. **Test basic connectivity**:
   ```bash
   # Test if API server is running
   curl http://localhost:5000/health

   # Test API routes
   curl http://localhost:3001/api/data/provinces
   ```

3. **Check API client configuration**:
   ```typescript
   // lib/config/env.ts - verify base URL
   console.log('API URL:', API_BASE_URL);
   ```

### ❌ OpenAPI type generation fails

**Problem**: `openapi-typescript` not found or Swagger URL invalid

**Solutions**:

1. **Install openapi-typescript**:
   ```bash
   npm install --save-dev openapi-typescript
   ```

2. **Test with sample data**:
   ```bash
   npm run generate:types:test
   ```

3. **Generate from real API**:
   ```bash
   # Replace with your actual Swagger URL
   npm run generate:types https://your-api.com/swagger/v1/swagger.json
   ```

4. **Manual generation**:
   ```bash
   npx openapi-typescript scripts/sample-swagger.json --output lib/api/types/generated.ts
   ```

### ❌ Build fails

**Problem**: Next.js build errors

**Solutions**:

1. **Clean build**:
   ```bash
   npm run clean
   npm run build
   ```

2. **Check for missing imports**:
   ```bash
   npm run type-check  # Will show import errors
   ```

3. **Verify all dependencies**:
   ```bash
   npm ls --depth=0
   ```

### ❌ CORS or authentication issues

**Problem**: API requests blocked or auth failures

**Solutions**:

1. **Check CORS headers**:
   ```bash
   # API routes should return proper CORS headers
   curl -I http://localhost:3001/api/data/provinces
   ```

2. **Verify auth setup**:
   ```typescript
   // Check if JWT secret is set
   console.log('JWT Secret configured:', !!process.env.NEXT_PUBLIC_JWT_SECRET);
   ```

3. **Test auth endpoints**:
   ```bash
   # Should return 401 without token
   curl http://localhost:3001/api/auth/me
   ```

### 🔧 Development Tools

**Debug API calls**:
```typescript
// Add to lib/api/client.ts for debugging
console.log('API Request:', {
  url,
  method: options.method,
  correlationId
});
```

**Monitor network requests**:
```bash
# Use browser DevTools Network tab
# Check for failed requests and CORS errors
```

**Test API client directly**:
```typescript
// In browser console or test file
import { apiClient } from '@/lib/api';

apiClient.get('/test').then(console.log).catch(console.error);
```

### 📞 Support

If issues persist:

1. **Check the logs**: `npm run dev` will show detailed error messages
2. **Run diagnostics**: `npm run test:phase2` shows what's working
3. **Verify environment**: Ensure all required environment variables are set
4. **Check Node.js compatibility**: Use LTS version (18.x or 20.x)

### 🚀 Quick Recovery

**One-command recovery**:
```bash
npm run setup  # Cleans everything and reinstalls
```

**Manual recovery**:
```bash
rm -rf node_modules .next package-lock.json
npm install --legacy-peer-deps
npm run type-check
npm run build
npm run dev
```