# Apify Agent Skills — Web Scraping for OMC

[Apify Agent Skills](https://github.com/apify/agent-skills) adds 55+ platform scraping to Claude Code. Combined with OMC agents, you get AI-driven data collection and analysis.

## Setup

```bash
# In Claude Code session
/plugin marketplace add https://github.com/apify/agent-skills
/plugin install apify-ultimate-scraper@apify-agent-skills
/reload-plugins
```

Requires: Apify account + API token (free tier available at [apify.com](https://apify.com)).

## What It Scrapes

Social media: Twitter, TikTok, Instagram, Facebook, YouTube, Reddit
E-commerce: Amazon, eBay, Walmart, Etsy
Travel: Booking.com, TripAdvisor, Airbnb
Business: Google Maps, LinkedIn, Crunchbase
And 40+ more platforms.

## Using with OMC

### Data collection via executor
```
/team 1:executor "scrape the top 50 TikTok videos about AI coding, extract titles, views, and engagement"
```

### Analysis pipeline
```
/autopilot "scrape Google Maps for coffee shops in Moscow, analyze ratings and reviews, create a summary report"
```

The executor agent calls Apify skills for scraping, then processes and analyzes the data — all in one workflow.

## vs Eclipse Claw

| Feature | Apify Skills | Eclipse Claw |
|---------|-------------|--------------|
| Runtime | Cloud (Apify platform) | Local (Rust binary) |
| Platforms | 55+ specialized scrapers | Any URL (generic) |
| Auth | Apify API token required | No account needed |
| Cost | Free tier, then pay-per-use | Free, unlimited |
| Best for | Social media, e-commerce data | Raw HTML/content extraction |

Use both: Eclipse Claw for generic web scraping, Apify for platform-specific data (social media APIs, Google Maps, etc.).
