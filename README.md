# Form Builder UI

A drag-and-drop Form Builder built with Laravel Blade components, Vanilla CSS, and SortableJS. No backend API calls are required for the form building interactions.

## Files Changed

Here is a step-by-step breakdown of the files modified and created for this assignment:

1. **`resources/views/layouts/admin.blade.php`**
   - Included SortableJS and FontAwesome via CDN.
   - Fixed missing `</div>` tag for the `.page` container.
2. **`resources/views/includes/navigation.blade.php`**
   - Removed premature closing `</body>` and `</div>` tags to fix the layout overlap issue where the sidebar and header would hide the form builder canvas.
3. **`resources/views/includes/css.blade.php`**
   - Linked the new `form-builder.css` file to the layout.
4. **`public/css/form-builder.css` (NEW)**
   - Added all Vanilla CSS3 styling for the drag-and-drop form, canvas area, field settings, tabs, and layout grids.
5. **`resources/views/components/*.blade.php` (NEW)**
   - Created 18 individual Laravel Blade components (e.g. `text-input.blade.php`, `dropdown.blade.php`, etc.) for every field type. These provide the HTML skeleton cloned into the canvas without raw HTML string manipulation.
6. **`resources/views/form.blade.php`**
   - Rewrote the main content view to host the drag-and-drop `.fb-canvas` and `.fb-sidebar` (palette).
   - Added `<template>` tags at the bottom to hold the pre-rendered Blade components for Javascript cloning.
   - Included the `form-builder.js` script.
7. **`public/js/form-builder.js` (NEW)**
   - Built the entire Form Builder logic in Vanilla Javascript.
   - Handled `SortableJS` drag and drop events, dynamic UI re-rendering, settings updates (Label, Placeholder, Options mapping), and LocalStorage persistence.

## DnD Library Choice & Rationale

**SortableJS**
I chose SortableJS because it's a lightweight, mature, and powerful vanilla JavaScript library for drag and drop. Since the assignment required "App runs with php artisan serve - no extra config steps", avoiding npm dependencies requiring a build step (like React DnD or Vue.Draggable) was crucial. SortableJS can be easily imported via CDN and provides excellent performance and native HTML5 drag and drop APIs without the overhead of a large framework.

## Assumptions Made

1. The "Next" button should simply dump the JSON schema. It uses `alert()` and `console.log()` to display the JSON output as there is no backend API to submit to.
2. Form fields are cloned from hidden Blade templates using Vanilla JS. This perfectly satisfies the "UI must use Laravel Blade component for all form field elements - no raw HTML inputs" and "No API calls needed" constraints.
3. Vanilla CSS3 was used instead of Tailwind CSS, per specific instruction.

## Sample JSON Output

```json
{
  "title": "Registration Form",
  "fields": [
    {
      "id": "field_1699543200000",
      "type": "text-input",
      "label": "First Name",
      "placeholder": "Enter your first name",
      "required": true,
      "options": [],
      "cssClass": "custom-input",
      "defaultValue": "",
      "minChars": "2",
      "maxChars": "50"
    },
    {
      "id": "field_1699543210000",
      "type": "dropdown",
      "label": "Country",
      "placeholder": "",
      "required": false,
      "options": [
        "United States",
        "Canada",
        "United Kingdom"
      ],
      "cssClass": "",
      "defaultValue": "",
      "minChars": "",
      "maxChars": ""
    }
  ]
}
```
