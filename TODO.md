# TODO: Update Theme to Aesthetic Light Mode Only

## Information Gathered
- The application currently supports light, dark, and system themes, with mostly black and white colors.
- Theme switching is handled by `use-appearance.tsx`, `appearance-dropdown.tsx`, and `appearance-tabs.tsx`.
- Colors are defined in `resources/css/app.css` using CSS variables.
- User wants to remove dark mode and make light mode more aesthetic with comfortable, colorful palettes (e.g., light blue backgrounds, pastel accents).

## Plan
- Update `use-appearance.tsx` to only support 'light' mode, remove dark and system logic.
- Remove dark and system options from `appearance-dropdown.tsx` and `appearance-tabs.tsx`.
- Update CSS variables in `app.css` to use aesthetic colors for light mode (e.g., light blue background, green primary, pastel accents).
- Remove `.dark` styles from `app.css`.
- Set default appearance to 'light'.

## Dependent Files to Edit
- `resources/js/hooks/use-appearance.tsx`
- `resources/js/components/appearance-dropdown.tsx`
- `resources/js/components/appearance-tabs.tsx`
- `resources/css/app.css`

## Followup Steps
- Run the application to test the new theme.
- Verify that no dark mode references remain and colors look aesthetic.
