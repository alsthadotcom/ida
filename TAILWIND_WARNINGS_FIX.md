# Fixing Tailwind CSS Warnings in VS Code

## The Issue
You're seeing "Unknown at rule @tailwind" and "Unknown at rule @apply" warnings in `index.css` because the CSS language server doesn't natively recognize Tailwind CSS directives.

## Solutions

### Solution 1: Install Tailwind CSS IntelliSense Extension (Recommended)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Tailwind CSS IntelliSense"
4. Install the official extension by Tailwind Labs
5. Reload VS Code

This extension will:
- Remove all warnings for Tailwind directives
- Provide autocomplete for Tailwind classes
- Show color previews
- Provide hover documentation

### Solution 2: Configure VS Code Settings Manually

If you can't or don't want to install the extension, manually update your VS Code settings:

1. Open VS Code Settings (Ctrl+, or Cmd+,)
2. Search for "css.lint.unknownAtRules"
3. Set it to "ignore"

Or add this to your `.vscode/settings.json`:

```json
{
  "css.validate": false,
  "css.lint.unknownAtRules": "ignore",
  "scss.validate": false,
  "less.validate": false,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Solution 3: Use the Custom Data File

I've created a `css.customdata.json` file in your project root. To use it:

1. Create or update `.vscode/settings.json` with:
```json
{
  "css.customData": ["./css.customdata.json"]
}
```

## Important Notes

- These are **warnings, not errors** - your code will work perfectly fine
- The project is already properly configured with:
  - ✅ `tailwind.config.ts`
  - ✅ `postcss.config.js`
  - ✅ Tailwind CSS dependencies installed
- The build process will work correctly regardless of these IDE warnings

## Verification

After applying any solution, reload VS Code and the warnings should disappear.

## Why This Happens

VS Code's built-in CSS language server validates CSS against standard CSS syntax. Since `@tailwind`, `@apply`, and `@layer` are PostCSS/Tailwind-specific directives (not standard CSS), the validator flags them as unknown. This is normal and expected behavior without proper configuration or the Tailwind IntelliSense extension.
