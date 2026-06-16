# AGENTS.md

This file provides guidance to coding agents working in this repository.

## Project Context

This repository is for the Resilience 17 Node.js Backend Engineer assessment. Build the Creator Card API using the provided `the17thstudio/node-template` structure and conventions.

Follow the assessment requirements exactly:

- Use Node.js, vanilla JavaScript, Express, and MongoDB.
- Keep endpoints at the root: `POST /creator-cards`, `GET /creator-cards/:slug`, and `DELETE /creator-cards/:slug`.
- Do not add URL versioning such as `/api`, `/v1`, or `/api/v1`.
- Use the template's services, endpoints, messages, repositories, models, middleware, validator, and error utilities.

## Project Workflow

- Do not create new worktrees. Work in the existing checkout unless explicitly asked otherwise.
- Do not create new branches unless explicitly requested.
- Preserve existing style, naming, organization, and framework patterns.
- Keep changes scoped to the requested task.
- Avoid unrelated refactors, formatting churn, or dependency changes unless required.
- Prefer existing packages, utilities, and project conventions over new abstractions.
- Stop after each planned task or phase and wait for user approval before proceeding.

## Coding Style

- Use `camelCase` for variables and functions.
- Use `PascalCase` for classes and model exports.
- Use `SCREAMING_SNAKE_CASE` for constants.
- Use `snake_case` for request, response, and database fields when matching the API contract.
- Keep variable and function names short but clear. Avoid overly long names when a concise name is understandable in context.
- Avoid code comments by default. Add comments only when they are mandatory, clarify non-obvious behavior, or prevent a likely maintenance mistake.
- Keep files focused on one responsibility.
- Keep services as `(serviceData, options = {})` functions when following the template pattern.
- Validate service input first with the template VSL validator before business logic.
- Keep endpoint handlers thin; delegate business logic to services.

## Security

- Never commit secrets, private keys, `.env` files, credentials, tokens, or database passwords.
- Keep `.env.example` current when adding required environment variables.
- Do not add authentication, API keys, bearer-token checks, or auth middleware unless the assessment explicitly requires it.

## Testing and Verification

- Run the relevant tests when practical before reporting completion.
- If verification is skipped, state the reason clearly.
- For API changes, verify the expected HTTP status codes and JSON response shapes.
- Ensure validation failures return HTTP 400.
- Ensure assessment business errors return the exact required custom `code` values.

## Git and GitHub

- Do not stage, commit, push, open, merge, close, or modify pull requests without explicit user permission.
- Before committing, summarize what would be staged and wait for approval unless the user has already given a direct commit instruction.
- Do not use commit descriptions or co-author trailers.
- Keep commits focused and honest when the user approves them.
- Do not include local screenshots, generated previews, build outputs, caches, or non-core assets unless explicitly requested.
- Use conventional commit prefixes when the user asks for a commit and they fit the change: `feat:`, `fix:`, `perf:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`, `build:`, or `ci:`.
