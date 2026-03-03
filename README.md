# LotusDharma - Buddhist App Frontend

Ứng dụng web Phật giáo LotusDharma được xây dựng với Next.js 15, TypeScript, và kiến trúc scalable để phục vụ 1M-10M người dùng.

## ✨ Tính năng

- 🗺️ **Map Visualization**: Hiển thị bản đồ Việt Nam với dữ liệu tỉnh/thành, quận/huyện, xã/phường
- 📚 **Teachings**: Khám phá bài giảng Phật pháp với tìm kiếm và lọc nâng cao
- 🧘 **Meditation**: Các bài hướng dẫn thiền với audio và timer
- 👤 **User Progress**: Theo dõi tiến độ học tập và thiền tập cá nhân
- 🔐 **Authentication**: JWT-based authentication với refresh token
- 🌐 **i18n Ready**: Sẵn sàng đa ngôn ngữ (Việt + Anh)
- ⚡ **Performance**: ISR, caching, và optimization cho high-traffic

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Clone repository
git clone <repository-url>
cd lotus-dharma-fe

# Setup project (recommended)
npm run setup

# Hoặc manual setup
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
# Generate secure secrets
npm run generate-secrets

# Copy generated secrets to .env.local
# (Script sẽ hiển thị secrets, copy vào .env.local)

# Verify environment setup
npm run verify
```

### 3. Start Development Server

```bash
npm run dev
# Server chạy tại http://localhost:3001
```

### 4. Test API Integration

```bash
# Test data endpoints
curl http://localhost:3001/api/data/provinces
curl http://localhost:3001/api/data/communes

# Generate API types từ Swagger
npm run generate:types https://your-api.com/swagger/v1/swagger.json
```

## 📋 Environment Variables

Tạo file `.env.local` với các biến sau:

```bash
# Required
NEXT_PUBLIC_JWT_SECRET=<64-char hex string>
CSRF_SECRET=<64-char hex string>
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional
NODE_ENV=development
LOG_LEVEL=info
FEATURE_I18N=false
```

Xem `.env.example` để biết đầy đủ các biến.

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Production server

# Setup & Configuration
npm run setup           # Full project setup
npm run setup:force     # Force install dependencies
npm run generate-secrets # Generate JWT/CSRF secrets

# API & Types
npm run generate:types   # Generate types from Swagger
npm run generate:types:test # Generate sample types

# Quality Assurance
npm run type-check      # TypeScript validation
npm run lint           # ESLint checking
npm run lint:fix       # Fix ESLint issues
npm run test:phase2    # Test Phase 2 completion

# Maintenance
npm run clean          # Clean all caches
npm run clean:next     # Clean Next.js cache
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: TanStack Query + Zustand
- **Maps**: Leaflet + React-Leaflet
- **Forms**: React Hook Form + Zod
- **API**: Custom client với retry & circuit breaker

### Project Structure
```
├── app/                 # Next.js App Router
│   ├── api/            # BFF Route Handlers
│   └── (public)/       # Public pages
├── components/         # React components
│   ├── features/       # Feature-based components
│   ├── ui/            # Reusable UI components
│   └── layouts/       # Layout components
├── lib/               # Business logic & utilities
│   ├── api/           # API client & types
│   ├── auth/          # Authentication utilities
│   ├── config/        # Configuration
│   └── stores/        # State management
├── public/            # Static assets
└── scripts/           # Build & utility scripts
```

## 🔧 Development

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks (sẽ thêm sau)

### API Integration
- **OpenAPI**: Auto-generate TypeScript types
- **Error Handling**: Comprehensive error boundaries
- **Caching**: ISR + TanStack Query + Redis (optional)
- **Security**: JWT + CSRF + Rate limiting

### Performance
- **Core Web Vitals**: Optimized cho Lighthouse 90+
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Next.js Image component
- **Caching Strategy**: Multi-layer caching

## 🚨 Troubleshooting

Nếu gặp lỗi, xem `TROUBLESHOOTING.md` hoặc:

1. **Environment Issues**: `npm run generate-secrets`
2. **Dependency Issues**: `npm run setup:force`
3. **Type Issues**: `npm run clean:next && npm run type-check`
4. **API Issues**: Check backend server running

## 📈 Roadmap

### Phase 2 ✅ (Current)
- API Client Layer hoàn chỉnh
- Authentication & Authorization
- Type Safety với OpenAPI
- Error Handling & Resilience

### Phase 3 🔄 (Next)
- TanStack Query Provider
- Zustand State Management
- i18n Implementation
- UI Components Library

### Phase 4 📋 (Planned)
- Authentication UI
- User Dashboard
- Teaching Pages
- Meditation Features

### Phase 5 🎯 (Future)
- PWA Features
- Analytics Integration
- Advanced Caching
- Performance Monitoring

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Follow coding standards trong `.cursor/rules/`
4. Test thoroughly: `npm run type-check && npm run build`
5. Submit pull request

## 📄 License

This project is part of LotusDharma ecosystem.

## 🙏 Acknowledgments

Built with ❤️ for the Buddhist community.
