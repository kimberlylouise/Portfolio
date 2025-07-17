# Portfolio Development Setup

## Quick Start Options

### Option 1: Simple Local Server (Recommended)
If you have Python installed:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

If you have Node.js installed:
```bash
# Using npx (comes with Node.js)
npx serve .

# Or install a simple server globally
npm install -g live-server
live-server
```

### Option 2: VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Direct File Opening
Simply double-click `index.html` to open in your default browser.
*Note: Some features may not work due to CORS restrictions*

## Development Workflow

1. **Edit Files**: Make changes to HTML, CSS, or JavaScript files
2. **Refresh Browser**: See changes immediately (or use live reload)
3. **Test Responsiveness**: Use browser dev tools to test different screen sizes
4. **Validate**: Check for HTML/CSS validation errors

## Useful Browser Dev Tools

### Chrome/Edge DevTools
- **F12** or **Ctrl+Shift+I** to open
- **Ctrl+Shift+M** for mobile view
- **Ctrl+Shift+C** to inspect elements

### Testing Checklist
- [ ] Test on different screen sizes
- [ ] Check dark/light theme toggle
- [ ] Test navigation (mobile menu)
- [ ] Verify form validation
- [ ] Test project filtering
- [ ] Check smooth scrolling
- [ ] Verify accessibility (keyboard navigation)

## File Watching (Optional)
For automatic browser refresh when files change:

```bash
# If you have npm
npm install -g browser-sync
browser-sync start --server --files "*.html, css/*.css, js/*.js"
```

## Production Deployment

### Before Deployment:
1. Optimize all images
2. Update all personal information
3. Test on multiple browsers
4. Validate HTML/CSS
5. Check for console errors

### Deployment Platforms:
- **GitHub Pages**: Free, easy setup
- **Netlify**: Free tier with forms support
- **Vercel**: Fast deployment
- **Firebase Hosting**: Google's platform

Happy coding! 🚀
