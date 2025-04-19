# Campaign Tracking for Adobe Launch

A robust JavaScript solution for automated website traffic sources  detection in Adobe Analytics.

## Overview

This library automatically identifies and classifies website traffic sources to enable accurate campaign tracking and attribution.

## Features

- **Comprehensive Traffic Source Detection**: 
  - Identifies traffic from:
    - Search Engine Advertising (SEM/SEA)
    - Search Engine Optimization (SEO)
    - Social Media platforms
    - Email providers
    - Internal referrals
    - Direct traffic

- **Automatic ECID Management**: Extracts and processes Campaign Tracking IDs from URL parameters

- **Session-Based Processing**: Only runs on first page view of a session

- **Robust Pattern Matching**: Uses reliable detection patterns for each traffic source

## How It Works

The script detects incoming traffic sources through several methods:

1. **ECID URL Parameter**: Checks for explicit campaign tracking via `ecid` parameter
2. **Paid Search Detection**: Identifies SEA traffic via `gclid` (Google) and `msclkid` (Bing) parameters
3. **Organic Search Detection**: Analyzes referrer domains to detect organic search traffic
4. **Social Media Detection**: Recognizes traffic from numerous social platforms
5. **Email Client Detection**: Identifies traffic coming from email clients
6. **Direct Traffic**: Handles sessions with no referrer information

Detected traffic sources are pushed to Adobe's Data Layer for further processing in Adobe Analytics.

## Implementation

### Prerequisites

- Adobe Launch implementation
- `_satellite` object available for testing purposes
- `adobeDataLayer` configured and accessible
- `sessionStorage` access for event counting

### Installation

1. Add this script as a custom code action in Adobe Launch 
2. Configure it to run at the beginning of page load before Adobe Analytics Action executes
3. Ensure it has access to referrer information

### Code Structure

The implementation follows a modular approach:

```javascript
// Helper functions for readability and DRY code
const hasReferrer = () => referrer !== undefined && referrer.length >= 1;
const hasNoEcidParam = () => queryParam.indexOf('ecid') === -1;
// ...more helpers

// Primary tracking function
const trackCampaign = () => {
  // Logic for detecting and categorizing traffic sources
  // ...
};

// Execute tracking with error handling
try {
  trackCampaign();
} catch (error) {
  _satellite.logger.log('Error in campaign tracking: ' + error.message);
}
```

## Traffic Source Classification

The script categorizes traffic into these main groups:

| Category | Sub-category | Example | ECID Format |
|----------|--------------|---------|-------------|
| SEA | Google | Google Ads traffic | sea.auto_tag.auto_tag.google.nn.nn.nn.nn.nn. |
| SEA | Bing | Microsoft Ads traffic | sea.auto_tag.auto_tag.bing.nn.nn.nn.nn.nn. |
| SEO | Google | Organic Google search | seo.auto_tag.auto_tag.google.nn.nn.nn.nn.nn. |
| SEO | Other | Other search engines | seo.auto_tag.auto_tag.other.nn.nn.nn.nn.nn. |
| Social | Facebook | Facebook traffic | socialmedia.auto_tag.auto_tag.facebook.nn.nn.nn.nn.nn. |
| Social | Twitter | Twitter/X traffic | socialmedia.auto_tag.auto_tag.twitter.nn.nn.nn.nn.nn. |
| Email | Other | Email client referrals | email.auto_tag.auto_tag.other.nn.nn.nn.nn.nn. |
| Direct | No referrer | Direct visits | dir.auto_tag.auto_tag.no-referrer.nn.nn.nn.nn.nn. |
| Internal | Auto tag | Internal traffic | int.auto_tag.auto_tag.auto_tag.nn.nn.nn.nn.nn. |

## Best Practices

- **Testing**: Verify detection using various traffic sources and campaign parameters
- **Monitoring**: Review data in Adobe Analytics to ensure proper attribution
- **Maintenance**: Update patterns as search engines and social platforms evolve
- **Performance**: This script is designed to execute quickly and only on first page view

## Troubleshooting

- **Debug Logging**: The script logs detailed information using `_satellite.logger.log`
- **Common Issues**: 
  - Referrer information missing due to cross-domain security policies
  - Event counting issues if sessionStorage is unavailable
  - Pattern matching failing for new or changed referrer formats, make sure to keep the pattern up to date

## Advanced Configuration

The traffic detection patterns can be modified in the `patterns` object to add or update detection for new traffic sources:

```javascript
const patterns = {
  sea: {
    google: (referrerContains('gclid') && !referrerContains('msclkid')) || 
            (referrerContains('gclid') && referrerContains('google')),
    // Add or modify patterns here
  },
  // ...other categories
};
```

## License

[MIT License](LICENSE)

## Contributing

Contributions to improve detection patterns or add new traffic sources are welcome. Please submit a pull request with your changes.