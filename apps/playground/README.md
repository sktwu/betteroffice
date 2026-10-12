# BetterOffice Theme Playground

Interactive theme development environment. Experiment with colors and see live updates in real time.

## Quick Start

```bash
bun install
bun run build:docx-wasm && bun run build:pptx-wasm && bun run build:xlsx-wasm
bun run build:theme && bun run build:fonts && bun run build:docx && bun run build:pptx && bun run build:xlsx
cd apps/playground
bun run dev
```

Opens at `http://localhost:5174`

## Pages

### Word / PowerPoint / Excel
Real `DocxEditor`, `PptxEditor` and `XlsxEditor` instances. Each opens a sample from `apps/demo/public`; use **Open** or drop a local file to replace it. The theme panel stays on the left, so seed and mode changes apply to the open document. PowerPoint and Excel do not follow the theme yet.

### Theme Lab
Main development environment. Adjust primary and neutral colors with live preview.

- **Color Pickers**: Input hex values or use native color input
- **Component Preview**: See buttons, inputs, cards, and status boxes update in real-time
- **Token Inspector**: View all 40+ tokens and their computed values
- **Light/Dark Toggle**: Switch modes and see color inversion algorithm in action

### Simple Mode
Minimal interface - adjust primary color and auto-derive all other tokens.

Perfect for quick prototyping and understanding the auto-derivation algorithm.

### Component Gallery
Showcase of all UI components (buttons, inputs, cards, status badges) in both light and dark modes.

## Features

✨ **Real-time token generation** - See all colors update as you adjust inputs  
✨ **Light/Dark mode toggle** - Smooth transitions with CSS variables  
✨ **Color swatch display** - Visualize each token value  
✨ **Responsive design** - Works on desktop and tablet  

## Customization

### Add new components

Edit `src/pages/ComponentGallery.tsx` to add more component examples.

### Modify default colors

Edit the initial `seed` state in `src/main.tsx`; it is passed to `BetterOfficeThemeProvider`.

## Technology Stack

- **Vite 5**: Lightning-fast dev server and build
- **React 19**: UI library
- **@betteroffice/theme**: Core generation
- **@betteroffice/docx-react**: Editor integration and theming hooks
- **CSS Variables**: Token application

## Browser Support

- Chrome 100+
- Firefox 97+
- Safari 15.4+
- Edge 100+

All modern browsers with CSS variable support.

## License

Apache-2.0
