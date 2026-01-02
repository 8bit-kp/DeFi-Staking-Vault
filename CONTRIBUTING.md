# Contributing to DeFi Staking Vault

Thank you for considering contributing to the DeFi Staking Vault project!

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, wallet, etc.)

### Suggesting Features

Feature requests are welcome! Please:
- Search existing issues first
- Describe the feature clearly
- Explain the use case and benefits
- Include mockups or examples if relevant

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/defi-staking-vault.git
   cd defi-staking-vault
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test thoroughly**
   ```bash
   # Test smart contracts
   cd defi-staking-vault
   npx hardhat test
   
   # Test frontend
   cd ../staking-vault-frontend
   npm run build
   npm run dev
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test changes
   - `chore:` - Build/config changes

6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```
   Then open a Pull Request on GitHub

## Code Style Guidelines

### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for functions
- Add comprehensive tests for new functions

### TypeScript/React
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components focused and reusable

### CSS/Tailwind
- Use Tailwind utility classes
- Keep custom CSS minimal
- Maintain responsive design

## Testing Requirements

### Smart Contracts
- Add unit tests for new functions
- Ensure 100% test coverage for critical paths
- Test edge cases and error conditions

### Frontend
- Test in multiple browsers
- Test wallet connections
- Test transaction flows
- Verify responsive design

## Security

- Never commit private keys or sensitive data
- Review smart contract changes carefully
- Report security issues privately
- Follow OpenZeppelin security practices

## Documentation

When contributing, please update:
- Code comments
- README.md (if needed)
- Function documentation
- Type definitions

## PR Checklist

Before submitting your PR, ensure:
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] No sensitive data committed
- [ ] Code follows style guidelines

## Good First Issues

Look for issues labeled `good first issue` for beginner-friendly contributions!

## Questions?

- Open a discussion in the repository
- Comment on relevant issues
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making DeFi Staking Vault better!
