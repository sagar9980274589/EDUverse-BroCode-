# Using Piston API for EDUverse Coding Challenges

This document provides information about the Piston API integration for the EDUverse coding challenges feature.

## Overview

The EDUverse platform uses the Piston API to execute code submitted by users in a secure and sandboxed environment. This allows students to solve coding challenges directly within the platform without needing to use external IDEs or compilers.

## About Piston API

[Piston](https://github.com/engineer-man/piston) is a free and open-source code execution engine that supports multiple programming languages. We're using the public instance hosted at [emkc.org/api/v2/piston](https://emkc.org/api/v2/piston), which doesn't require any API keys or authentication.

### Key Features

- **Free to use**: No API keys or subscriptions required
- **Multiple languages**: Supports Python, JavaScript, Java, C++, and many more
- **Secure execution**: Code runs in isolated containers
- **Open source**: The entire project is open source and can be self-hosted if needed

## Supported Languages

The EDUverse platform currently supports the following languages for coding challenges:

- Python 3.10.0
- JavaScript (Node.js 18.15.0)
- Java 15.0.2
- C++ 10.2.0
- C 10.2.0

## API Endpoints

The Piston API provides several endpoints:

- `GET /runtimes`: List all available languages and versions
- `POST /execute`: Execute code in a specified language

## Rate Limits

The public Piston API instance has rate limits to prevent abuse. If you encounter rate limiting issues, consider:

1. Adding a delay between submissions
2. Self-hosting your own Piston instance
3. Implementing a queue system for code execution requests

## Self-Hosting Option

If you need more control or higher rate limits, you can self-host Piston:

1. Follow the [installation instructions](https://github.com/engineer-man/piston)
2. Update the `PISTON_API_URL` in your `.env` file to point to your instance

## Troubleshooting

If you encounter issues with code execution:

1. Check that the Piston API is accessible from your server
2. Verify that the code being submitted is valid for the selected language
3. Check the server logs for any error messages
4. Ensure the code doesn't exceed execution time or memory limits

## Credits

Piston is developed and maintained by the [Engineer Man](https://github.com/engineer-man) community. We thank them for providing this valuable free service.
