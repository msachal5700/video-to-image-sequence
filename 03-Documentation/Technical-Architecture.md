# Technical Architecture

## Overview
High-level architecture of the Video to Image Sequence Converter application.

## Frontend Structure
```
src/
├── components/         # Reusable UI components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── ai/                 # AI-related utilities
├── models/             # ML model definitions
├── i18n/               # Internationalization
├── index.css           # Global styles
└── index.tsx           # Entry point
```

## Key Components
- **FramePicker**: Main UI for selecting frames from video
- **Dropzone**: File upload component with drag-and-drop
- **ProcessingOverlay**: Shows progress during video processing
- **SEOHead**: Manages meta tags for social sharing
- **Toast**: Notification system

## AI Integration
- Uses TensorFlow.js models for frame analysis
- Models loaded dynamically to reduce initial bundle size
- Frame scoring based on:
  - Visual clarity (sharpness, contrast)
  - Content relevance (faces, objects)
  - Composition (rule of thirds, subject placement)

## Data Flow
1. User uploads video → Dropzone component
2. Video processed to extract frames → useFramePicker hook
3. Frames analyzed by AI models → frameAnalyzer.ts
4. Frames scored and ranked → scoreEngine.ts
5. Top frames displayed in gallery → FrameGallery component
6. User selects frames → Download as images/ZIP

## Performance Considerations
- Web Workers for heavy processing (frame extraction)
- Lazy loading of AI models
- Canvas-based frame extraction for better performance
- Memoization of expensive calculations
- Progressive enhancement for older browsers

## Security Notes
- All processing happens client-side (no video uploads to server)
- File API used for local file handling
- No external API calls for core functionality
- Sanitization of filenames for downloads

## Related Notes
- [[Development Setup]]
- [[AI Frame Selection Algorithm]]
- [[Performance Optimization Guide]]
- [[Component Library Documentation]]

## Tags
#technical-architecture #frontend #react #ai