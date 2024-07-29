# Apps Script Flight Search

## General Description

This personal project/experiment is a Javascript Apps Script application linked to a Google Sheet. It uses RapidAPI endpoints to search for flights given dates and airports, returning a list of flights with links to purchase tickets, and saves a history of searches.

- **Technology Stack**: Google Apps Script
- **Integration**: Google Sheets
- **API**: RapidAPI (Skyscanner)

You can access the Google Sheet at:
[Flight Search Google Sheet](https://docs.google.com/spreadsheets/d/1pzw7R8CsPcRze-RPXLMO_BoFagba7TEoMUs3gNjI7jw/edit?usp=sharing)

You can access the main file at:
[Extraction.js](https://github.com/TdjHJ9zM5k/apps-script-flight-search/blob/main/Extraction.js.js)

## Screenshots

### Google Sheet Interface
<img src="https://github.com/TdjHJ9zM5k/apps-script-flight-search/blob/main/screenshots/flight_price_checker.png" alt="Flight Price Checker" width="600"/>

## Main Features

### Flight Search

Given departure and destination airport codes and a date, the script queries the Skyscanner API to retrieve flight options.

### Ticket Purchase Links

The results include links to purchase tickets directly from the search results.

### Search History

The application saves a history of previous searches for easy reference and comparison.
