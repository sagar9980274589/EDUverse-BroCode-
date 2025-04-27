# Setting Up Judge0 API for EDUverse Coding Challenges

This document provides instructions on how to set up the Judge0 API for the EDUverse coding challenges feature.

## Overview

The EDUverse platform uses the Judge0 API to execute code submitted by users in a secure and sandboxed environment. This allows students to solve coding challenges directly within the platform without needing to use external IDEs or compilers.

## Current Implementation

The current implementation includes a fallback simulation mode that works without the Judge0 API. This allows you to test and demonstrate the coding challenges feature without setting up the API. However, for a production environment, you should set up the Judge0 API for real code execution.

## Setting Up Judge0 API

### Option 1: Using RapidAPI (Recommended for Quick Setup)

1. Sign up for a RapidAPI account at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce) on RapidAPI
3. Get your API key from the RapidAPI dashboard
4. Add the following environment variables to your `.env` file:

```
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### Option 2: Self-Hosting Judge0 (Recommended for Production)

For production environments, it's recommended to self-host Judge0 to avoid API usage limits and reduce costs.

1. Follow the [Judge0 installation instructions](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure)
2. Add the following environment variables to your `.env` file:

```
JUDGE0_API_URL=http://your-judge0-instance-url
JUDGE0_API_KEY=your_auth_token_if_required
```

## Testing the Setup

After setting up the Judge0 API, you can test it by:

1. Starting the backend server
2. Navigating to the coding challenges section in the EDUverse platform
3. Trying to run and submit code

If the setup is successful, you should see real code execution results instead of simulated ones.

## Troubleshooting

If you encounter issues with the Judge0 API:

1. Check that your API key is correct
2. Verify that the API URL is accessible from your server
3. Check the server logs for any error messages
4. Make sure your subscription to the API is active (if using RapidAPI)

## Simulation Mode

If the Judge0 API is not configured or returns authentication errors, the system will automatically fall back to simulation mode. In this mode:

- Code execution is simulated on the backend
- Test results are generated based on simple pattern matching
- A note is displayed to users indicating that the results are simulated

This allows the feature to be demonstrated without a working API connection.
