# Form Builder UI

A drag-and-drop Form Builder built with Laravel Blade components, Vanilla CSS, and SortableJS. No backend API calls are required for the form building interactions.

## Setup Steps

1. Run `composer upgrade`
2. Run `php artisan serve`
3. Access the application at `http://localhost:8000` (or your configured port).

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
