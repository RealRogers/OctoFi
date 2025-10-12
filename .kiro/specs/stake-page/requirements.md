# Requirements Document

## Introduction

This document outlines the requirements for building the Stake page interface for the OctoFi DeFi application. The Stake page will allow users to view their active staking positions and explore available staking pools. The interface will display user positions with detailed information about staked amounts, rewards, and APY, as well as a table of available pools where users can stake their assets. This implementation focuses on the visual interface with hardcoded data, with interactive functionality to be added in future iterations.

## Requirements

### Requirement 1: User Positions Display Section

**User Story:** As a user, I want to view my active staking positions in a clear card layout, so that I can quickly see my staked assets, rewards earned, and APY for each position.

#### Acceptance Criteria

1. WHEN the Stake page loads THEN the system SHALL display a "Tus Posiciones" section with a heading
2. WHEN the "Tus Posiciones" section renders THEN the system SHALL display position cards in a two-column grid layout
3. WHEN viewing position cards THEN each card SHALL display the token logo, token name, APY percentage, staked amount, and rewards earned
4. WHEN viewing position cards THEN each card SHALL have a dark blue background with rounded corners and proper padding
5. WHEN viewing position cards THEN the system SHALL display two action buttons ("Reclamar" and "Retirar") at the bottom of each card

### Requirement 2: Position Card Component

**User Story:** As a user, I want each staking position to be displayed in a visually distinct card, so that I can easily distinguish between different assets I have staked.

#### Acceptance Criteria

1. WHEN a position card renders THEN the system SHALL display the token image at the top with appropriate sizing
2. WHEN a position card renders THEN the system SHALL display the token name as a heading below the image
3. WHEN a position card renders THEN the system SHALL display the APY percentage in a secondary text style
4. WHEN a position card renders THEN the system SHALL display "Monto en Staking" label with the staked amount value
5. WHEN a position card renders THEN the system SHALL display "Recompensas Ganadas" label with the rewards value
6. WHEN a position card renders THEN the system SHALL position the action buttons at the bottom using flexbox with auto-margin
7. WHEN viewing action buttons THEN the "Reclamar" button SHALL have a secondary style (dark background)
8. WHEN viewing action buttons THEN the "Retirar" button SHALL have a primary style (blue/purple gradient or accent color)

### Requirement 3: Available Pools Display Section

**User Story:** As a user, I want to view available staking pools in a table format, so that I can compare APY rates and total value locked across different assets.

#### Acceptance Criteria

1. WHEN the Stake page loads THEN the system SHALL display a "Pools Disponibles" section below the user positions
2. WHEN the "Pools Disponibles" section renders THEN the system SHALL display a table with column headers for "Activo", "APY", and "Total Staked (TVL)"
3. WHEN the pools table renders THEN the system SHALL use a dark background with rounded corners
4. WHEN the pools table renders THEN the system SHALL display a header row with column titles in a secondary gray color
5. WHEN the pools table renders THEN the system SHALL display pool rows with proper grid alignment matching the header columns

### Requirement 4: Pool Row Component

**User Story:** As a user, I want each available pool to be displayed as a row in the table, so that I can see the asset details and take action to stake.

#### Acceptance Criteria

1. WHEN a pool row renders THEN the system SHALL display the asset icon and name in the first column using flexbox alignment
2. WHEN a pool row renders THEN the system SHALL display the APY percentage in green color in the second column
3. WHEN a pool row renders THEN the system SHALL display the total staked amount (TVL) in the third column
4. WHEN a pool row renders THEN the system SHALL display a "Stake" button in the fourth column aligned to the right
5. WHEN viewing multiple pool rows THEN the system SHALL display subtle border dividers between rows
6. WHEN a pool row renders THEN the system SHALL use a 4-column grid layout to align with the table header

### Requirement 5: Page Layout and Structure

**User Story:** As a user, I want the Stake page to have a clear hierarchical structure, so that I can easily navigate between viewing my positions and exploring new pools.

#### Acceptance Criteria

1. WHEN the Stake page loads THEN the system SHALL display a main heading "Stake" at the top of the page
2. WHEN the Stake page loads THEN the system SHALL render the "Tus Posiciones" section first
3. WHEN the Stake page loads THEN the system SHALL render the "Pools Disponibles" section below with appropriate vertical spacing
4. WHEN the page renders THEN the system SHALL use the existing AppLayout component for consistent navigation
5. WHEN the page renders THEN the system SHALL apply proper responsive behavior for different screen sizes

### Requirement 6: Hardcoded Data Display

**User Story:** As a developer, I want to use hardcoded data for the initial implementation, so that the visual interface can be completed and reviewed before adding dynamic functionality.

#### Acceptance Criteria

1. WHEN the user positions section renders THEN the system SHALL display hardcoded data for Ethereum (2.5 ETH staked, 0.01 ETH rewards, 4.5% APY)
2. WHEN the user positions section renders THEN the system SHALL display hardcoded data for Optimism (1,250 OP staked, 15.3 OP rewards, 8.2% APY)
3. WHEN the available pools section renders THEN the system SHALL display hardcoded data for USD Coin (5.1% APY, $12.5M TVL)
4. WHEN the available pools section renders THEN the system SHALL display hardcoded data for Tether (4.9% APY, $25.2M TVL)
5. WHEN the available pools section renders THEN the system SHALL display hardcoded data for Arbitrum (11.3% APY, $8.1M TVL)

### Requirement 7: Component Architecture

**User Story:** As a developer, I want the Stake page to follow the atomic design pattern, so that components are reusable and maintainable.

#### Acceptance Criteria

1. WHEN implementing the feature THEN the system SHALL create a PositionCard molecule component for individual position cards
2. WHEN implementing the feature THEN the system SHALL create a PoolRow molecule component for individual pool table rows
3. WHEN implementing the feature THEN the system SHALL create a UserPositions organism component for the positions section
4. WHEN implementing the feature THEN the system SHALL create an AvailablePools organism component for the pools table section
5. WHEN implementing the feature THEN the system SHALL create a StakePage component that composes all organisms
6. WHEN implementing components THEN the system SHALL use TypeScript for type safety with proper prop interfaces

### Requirement 8: Styling and Visual Design

**User Story:** As a user, I want the Stake page to match the existing design system, so that the interface feels cohesive with the rest of the application.

#### Acceptance Criteria

1. WHEN position cards render THEN the system SHALL use a blue-tinted dark background (bg-blue-900/20 or similar)
2. WHEN position cards render THEN the system SHALL use rounded-2xl border radius
3. WHEN the pools table renders THEN the system SHALL use a dark background consistent with the design system
4. WHEN the pools table renders THEN the system SHALL use rounded-xl border radius
5. WHEN APY values render in the pools table THEN the system SHALL use green color (text-green-400 or similar)
6. WHEN buttons render THEN the system SHALL use the existing button component styles from the UI library
7. WHEN the page renders THEN the system SHALL use consistent spacing and padding matching the design mockup
