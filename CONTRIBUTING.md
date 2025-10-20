# Contributing to Secret Santa App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Follow the [SETUP.md](SETUP.md) guide to set up your local environment
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Code Style

### TypeScript

- Use TypeScript for all new files
- Enable strict mode
- Define proper interfaces/types
- Avoid `any` types when possible

### React

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components focused and small

### Naming Conventions

- **Files**: PascalCase for components (`SignInPage.tsx`), camelCase for utilities (`validation.ts`)
- **Components**: PascalCase (`CreateEventDialog`)
- **Functions**: camelCase (`createEvent`, `sendEmail`)
- **Constants**: UPPER_SNAKE_CASE (`API_KEY`, `MAX_PARTICIPANTS`)
- **Interfaces**: PascalCase with descriptive names (`Event`, `Participant`)

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components
├── contexts/       # React contexts
├── services/       # API/service layer
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── config/         # Configuration files

functions/
└── src/
    ├── index.ts    # Cloud Functions entry
    ├── draw.ts     # Draw logic
    ├── email.ts    # Email service
    └── types.ts    # Function types
```

## Making Changes

### Adding a New Feature

1. **Plan**: Discuss the feature in an issue first
2. **Design**: Consider UI/UX and data model changes
3. **Implement**: Write code following style guidelines
4. **Test**: Ensure all features work
5. **Document**: Update README if needed

### Fixing a Bug

1. **Reproduce**: Confirm the bug exists
2. **Identify**: Find the root cause
3. **Fix**: Implement the solution
4. **Test**: Verify the fix works
5. **Document**: Add comments if needed

## Testing

### Manual Testing

Before submitting a PR, test:

- [ ] Sign in flow
- [ ] Event creation
- [ ] Joining events
- [ ] Drawing assignments
- [ ] Email sending
- [ ] Mobile responsiveness
- [ ] Error handling

### Testing Checklist

- [ ] Code builds without errors
- [ ] No console errors in browser
- [ ] Functions deploy successfully
- [ ] All user flows work end-to-end
- [ ] Mobile UI is responsive
- [ ] Emails are delivered

## Pull Request Process

1. **Create PR**: Open a pull request with clear description
2. **Link Issues**: Reference any related issues
3. **Describe Changes**: Explain what changed and why
4. **Screenshots**: Include screenshots for UI changes
5. **Wait for Review**: Address any feedback

### PR Title Format

```
[Type] Brief description

Examples:
[Feature] Add participant notes
[Fix] Resolve email sending issue
[Refactor] Improve derangement algorithm
[Docs] Update setup instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
How was this tested?

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code builds successfully
- [ ] Tested locally
- [ ] Updated documentation
- [ ] No breaking changes
```

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Respond to feedback promptly
- Be open to suggestions
- Update based on reviews

### For Reviewers

- Be constructive and respectful
- Test the changes if possible
- Check for edge cases
- Verify documentation updates

## Architecture Decisions

### When to Use...

**Context vs Props**
- Use Context for: Auth state, theme, global settings
- Use Props for: Component-specific data, callbacks

**Service vs Component Logic**
- Services: API calls, data transformation
- Components: UI logic, user interactions

**Cloud Functions vs Client**
- Functions: Sensitive operations, email sending, complex algorithms
- Client: UI interactions, data display, form validation

## Security Considerations

When contributing, consider:

- [ ] No sensitive data in client code
- [ ] Proper authentication checks
- [ ] Firestore security rules updated
- [ ] Input validation on both client and server
- [ ] Email addresses validated
- [ ] No exposure of assignment data

## Performance Guidelines

- Minimize Firestore reads/writes
- Use batched writes when possible
- Implement proper loading states
- Optimize images and assets
- Lazy load routes if needed

## Documentation

When adding features, update:

- [ ] README.md (if user-facing)
- [ ] SETUP.md (if setup changes)
- [ ] Code comments (for complex logic)
- [ ] Type definitions (for new data structures)

## Common Issues

### Issue: Functions won't deploy

**Solution:**
```bash
cd functions
npm run build
# Check for TypeScript errors
```

### Issue: Firestore rules fail

**Solution:**
```bash
# Test rules locally
firebase emulators:start --only firestore
```

### Issue: Email not sending

**Solution:**
- Check SendGrid API key
- Verify sender email
- Check function logs

## Getting Help

- **Documentation**: Check README.md and SETUP.md
- **Issues**: Search existing issues or create new one
- **Discussions**: Use GitHub Discussions for questions

## Feature Requests

To request a feature:

1. Check if it already exists in issues
2. Create new issue with "Feature Request" label
3. Describe the feature and use case
4. Include mockups if applicable

## Bug Reports

To report a bug:

1. Check if it's already reported
2. Create new issue with "Bug" label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Browser/device info

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎅🎁

