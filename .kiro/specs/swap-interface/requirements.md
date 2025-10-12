# Requirements Document

## Introduction

This feature implements a SwapInterface component that provides users with a modern, intuitive interface for swapping tokens in a DeFi application. The component will be a pixel-perfect implementation of the provided design, featuring two input sections (from/to), token selection, transaction details display, and a prominent swap action button. This is a static UI implementation focused on visual fidelity and basic interactivity, without backend integration or wallet connectivity at this stage.

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a visually appealing swap interface that matches the design specifications, so that I have a professional and trustworthy experience when preparing to swap tokens.

#### Acceptance Criteria

1. WHEN the SwapInterface component is rendered THEN the system SHALL display a centered card with dark background (bg-gray-900 or theme equivalent), rounded corners (rounded-2xl), subtle border (border-gray-800), and generous padding (p-4)
2. WHEN the component loads THEN the system SHALL display an H1 title "Swap" above the card, centered, with large bold white typography
3. WHEN viewing the card THEN the system SHALL apply a background color slightly lighter than the page background to create visual hierarchy

### Requirement 2

**User Story:** As a user, I want to input the amount of tokens I'm paying, so that I can specify how much I want to swap.

#### Acceptance Criteria

1. WHEN the "Desde (Pagas)" section is rendered THEN the system SHALL display a container with darker background (bg-gray-950), rounded corners (rounded-xl), and padding (p-4)
2. WHEN viewing the input section THEN the system SHALL display a label "Desde (Pagas)" in small gray text at the top
3. WHEN the input field is rendered THEN the system SHALL display a large text input (text-3xl or text-4xl) with bold white text, placeholder "0.0", and no visible border
4. WHEN the input field is displayed THEN the system SHALL show "$0.00" in small gray text below the input field
5. WHEN viewing the section THEN the system SHALL use flexbox (flex justify-between items-center) to position the input on the left and token selector on the right
6. WHEN the section footer is rendered THEN the system SHALL display "Balance: 0.0" in gray text aligned to the right
7. WHEN the section footer is rendered THEN the system SHALL display a "MAX" button with accent color (blue/purple), positioned next to the balance text

### Requirement 3

**User Story:** As a user, I want to select which token I'm paying with, so that I can specify the source token for my swap.

#### Acceptance Criteria

1. WHEN the "Desde" token selector is rendered THEN the system SHALL display a button with the visual representation shown in the design (icons "B" and "E" with an arrow)
2. WHEN the token selector button is rendered THEN the system SHALL apply dark gray background, rounded corners, and appropriate padding
3. WHEN hovering over the token selector THEN the system SHALL display a pointer cursor to indicate interactivity

### Requirement 4

**User Story:** As a user, I want to see the amount of tokens I will receive, so that I understand the outcome of my swap before executing it.

#### Acceptance Criteria

1. WHEN the "Hasta (Recibes)" section is rendered THEN the system SHALL display a container with identical styling to the "Desde" section (bg-gray-950, rounded-xl, p-4)
2. WHEN viewing the section THEN the system SHALL display a label "Hasta (Recibes)" in small gray text at the top
3. WHEN the output field is rendered THEN the system SHALL display "0.0" in large bold white text (text-3xl or text-4xl)
4. WHEN the output field is displayed THEN the system SHALL show "$0.00" in small gray text below
5. WHEN no token is selected THEN the system SHALL display a "Seleccionar token" button with dark gray background (rounded-full), a generic icon, and a down arrow

### Requirement 5

**User Story:** As a user, I want to quickly reverse the swap direction, so that I can easily swap in the opposite direction without re-entering values.

#### Acceptance Criteria

1. WHEN the swap direction button is rendered THEN the system SHALL position it absolutely centered between the "Desde" and "Hasta" sections
2. WHEN the button is displayed THEN the system SHALL render a circular button with background matching the main card, a border, and an up/down arrows icon
3. WHEN hovering over the button THEN the system SHALL display a pointer cursor

### Requirement 6

**User Story:** As a user, I want to see transaction details before swapping, so that I can make an informed decision about the swap.

#### Acceptance Criteria

1. WHEN transaction details are rendered THEN the system SHALL display them below the "Hasta" section in a container
2. WHEN the details container is rendered THEN the system SHALL use flexbox (flex justify-between) to create rows for each detail
3. WHEN displaying the exchange rate THEN the system SHALL show "Tasa" label in gray and "1 ETH = 3,000 USDT" value in white
4. WHEN displaying price impact THEN the system SHALL show "Impacto en el precio" label in gray and "<0.01%" value in green (text-green-500)
5. WHEN displaying network fee THEN the system SHALL show "Tarifa de la red" label in gray and "~$5.42" value in white

### Requirement 7

**User Story:** As a user, I want a clear call-to-action button to execute the swap, so that I can easily complete my transaction.

#### Acceptance Criteria

1. WHEN the swap button is rendered THEN the system SHALL display it with full width (w-full)
2. WHEN the button is displayed THEN the system SHALL apply a gradient background from purple to blue (bg-gradient-to-r from-purple-600 to-blue-600)
3. WHEN the button is rendered THEN the system SHALL display "Swap" text in white, bold, and centered
4. WHEN the button is displayed THEN the system SHALL apply large rounded corners (rounded-xl or rounded-2xl) and generous vertical padding (py-4)
5. WHEN hovering over the button THEN the system SHALL display a pointer cursor

### Requirement 8

**User Story:** As a user, I want the input fields to be interactive, so that I can enter amounts and see the interface respond.

#### Acceptance Criteria

1. WHEN the component initializes THEN the system SHALL use React useState to manage the "Desde" input value
2. WHEN the component initializes THEN the system SHALL use React useState to manage the "Hasta" output value
3. WHEN a user types in the "Desde" input field THEN the system SHALL update the state with the entered value
4. WHEN the "Desde" value changes THEN the system SHALL keep the "Hasta" value at "0.0" (calculation logic to be implemented later)
5. WHEN the input field receives focus THEN the system SHALL maintain proper styling and user experience

### Requirement 9

**User Story:** As a developer, I want the component to be properly organized and maintainable, so that it can be easily extended with business logic later.

#### Acceptance Criteria

1. WHEN the component is created THEN the system SHALL place it in /src/components/organisms/SwapInterface.tsx
2. WHEN the component is implemented THEN the system SHALL use TypeScript for type safety
3. WHEN the component is built THEN the system SHALL use Tailwind CSS classes for all styling
4. WHEN icons are needed THEN the system SHALL use lucide-react or the project's icon library
5. WHEN the component is structured THEN the system SHALL separate concerns logically (input sections, transaction details, action button)
