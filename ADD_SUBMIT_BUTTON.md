# Final Step: Add Submit Button

## Location
File: `src/pages/SubmitIdea.tsx`  
Line: ~672 (after the "Next" button closing)

## Current Code (Line 672)
```tsx
              )}
            </div>
```

## Replace With This Code
```tsx
              )}
              {step === 4 && (
                <Button
                  variant="default"
                  onClick={handleSubmitIdea}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Submit Idea to Marketplace
                </Button>
              )}
            </div>
```

## What This Does
- Shows a "Submit to Marketplace" button ONLY on step 4
- Calls `handleSubmitIdea()` when clicked
- Beautiful gradient styling
- Sparkles icon for visual appeal

## That's It!
After adding this button, your integration is **100% complete**! 🎉

The form will now:
1. Collect all data
2. Submit to Supabase
3. Show success message
4. Redirect to marketplace
5. Idea appears in the marketplace!
