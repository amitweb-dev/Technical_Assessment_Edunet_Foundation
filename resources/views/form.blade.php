@extends('layouts.admin')
@section('content')
<div class="app-content">
    <div class="side-app">
        <!--Page-Header-->
        <div class="page-header" style="margin-top: 20px;">
            <h4 class="page-title">{{$title}}</h4>
        </div>
        <div class="fb-container" style="margin-top: 15px;">
            <div class="fb-canvas" id="fb-canvas">
                <div class="fb-empty-state" id="fb-empty-state">
                    Drag elements from the right panel to build your form
                </div>
            </div>
            
            <div class="fb-sidebar">
                <!-- <div class="fb-header" style="padding: 15px; border-bottom: 1px solid #dee2e6;">
                    <input type="text" class="fb-title-input" id="form-title" placeholder="Form Title" value="Untitled Form" maxlength="200">
                    <div class="fb-char-counter"><span id="title-char-count">13</span>/200 chars</div>
                    <div style="font-size:12px; color:#6c757d; margin-top:5px;">Form Submission URL: /api/submit</div>
                </div> -->
                
                <div class="fb-tabs">
                    <div class="fb-tab active" id="tab-editor">Form Editor</div>
                    <div class="fb-tab" id="tab-settings">Settings</div>
                </div>
                
                <div class="fb-sidebar-content" id="panel-editor">
                    <div style="display:flex; margin-bottom:15px; border-bottom:1px solid #dee2e6;">
                        <div class="fb-tab active" style="flex:1;text-align:center;font-size:14px;padding:8px;" id="subtab-add">Add Fields</div>
                        <div class="fb-tab" style="flex:1;text-align:center;font-size:14px;padding:8px;" id="subtab-options">Field Options</div>
                    </div>
                    
                    <div id="add-fields-panel">
                        <div class="fb-palette-grid" id="fb-palette">
                            <div class="fb-palette-item" data-type="text-input">Text Input</div>
                            <div class="fb-palette-item" data-type="text-area">Text Area</div>
                            <div class="fb-palette-item" data-type="number-input">Number Input</div>
                            <div class="fb-palette-item" data-type="email-input">Email Input</div>
                            <div class="fb-palette-item" data-type="phone-input">Phone Input</div>
                            <div class="fb-palette-item" data-type="dropdown">Dropdown</div>
                            <div class="fb-palette-item" data-type="radio-buttons">Radio Buttons</div>
                            <div class="fb-palette-item" data-type="checkboxes">Checkboxes</div>
                            <div class="fb-palette-item" data-type="date-picker">Date Picker</div>
                            <div class="fb-palette-item" data-type="file-upload">File Upload</div>
                            <div class="fb-palette-item" data-type="title-field">Title</div>
                            <div class="fb-palette-item" data-type="description-field">Description</div>
                            <div class="fb-palette-item" data-type="new-line">New Line</div>
                            <div class="fb-palette-item" data-type="page-break">Page Break</div>
                            <div class="fb-palette-item" data-type="hidden-field">Hidden Field</div>
                            <div class="fb-palette-item" data-type="location-state">State</div>
                            <div class="fb-palette-item" data-type="location-city">City</div>
                            <div class="fb-palette-item" data-type="location-state-city">State & City</div>
                        </div>
                    </div>
                    
                    <div id="field-options-panel" class="fb-hidden">
                        <div id="options-form"></div>
                    </div>
                </div>
                
                <div class="fb-sidebar-content fb-hidden" id="panel-settings">
                    <p style="color:#6c757d">Form settings.</p>
                </div>
                
                <div class="fb-footer">
                    <button class="fb-btn fb-btn-outline" id="btn-cancel">Cancel</button>
                    <button class="fb-btn fb-btn-primary" id="btn-next">Next</button>
                </div>
            </div>
        </div>
    </div>
</div>

<template id="tpl-text-input"><x-text-input /></template>
<template id="tpl-text-area"><x-text-area /></template>
<template id="tpl-number-input"><x-number-input /></template>
<template id="tpl-email-input"><x-email-input /></template>
<template id="tpl-phone-input"><x-phone-input /></template>
<template id="tpl-dropdown"><x-dropdown /></template>
<template id="tpl-radio-buttons"><x-radio-buttons /></template>
<template id="tpl-checkboxes"><x-checkboxes /></template>
<template id="tpl-date-picker"><x-date-picker /></template>
<template id="tpl-file-upload"><x-file-upload /></template>
<template id="tpl-title-field"><x-title-field /></template>
<template id="tpl-description-field"><x-description-field /></template>
<template id="tpl-new-line"><x-new-line /></template>
<template id="tpl-page-break"><x-page-break /></template>
<template id="tpl-hidden-field"><x-hidden-field /></template>
<template id="tpl-location-state"><x-location-state /></template>
<template id="tpl-location-city"><x-location-city /></template>
<template id="tpl-location-state-city"><x-location-state-city /></template>

<script src="{{ asset('js/form-builder.js') }}?v={{ time() }}"></script>
@endsection