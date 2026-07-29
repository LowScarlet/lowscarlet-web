# LowScarlet — Personal Portfolio & Visitor Social Hub

> A modern, interactive, and visually stunning personal developer portfolio built with Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, and Neon PostgreSQL + Drizzle ORM.

---

## Screenshots

### Homepage Overview
![Homepage View](public/screenshots/homepage.png)

### Visitor Social Center Drawer (`/social`)
![Visitor Social Center](public/screenshots/social.png)

### Featured Projects Panel (`/projects`)
![Featured Projects](public/screenshots/projects.png)

---

## Key Features

- **Next.js Parallel & Intercepting Routes**: Instant side-drawer modals (`@right/(.)social` & `@right/(.)projects`) with seamless routing and backdrop blur animations.
- **Interactive Visitor Social Center**:
  - Global page likes counter with instant optimistic updates.
  - Paginated comment feed with timestamp formatting and guest/custom display name modes.
  - Adorable sleeping cat animation (`cute-cat-sleep.gif`) sitting on the comment area.
  - Admin moderation capability for comment deletion.
- **Categorized Projects Showcase**: Filterable view for Web Applications, Games, and Digital Products.
- **Modern Dark Aesthetic**: Curated color gradients, sleek dark mode backdrop, custom animated typewriting hints, and pixel art accents.
- **Fully Responsive**: Custom drawer physics tailored for both mobile bottom sheets and desktop side panels.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) & [React Type Animation](https://github.com/ecomfe/react-type-animation) |
| **Database & ORM** | [Neon PostgreSQL](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/) |
| **State & Icons** | [Zustand](https://zustand-demo.pmnd.rs/) & [React Icons](https://react-icons.github.io/react-icons/) |

---

## Getting Started

### Prerequisites

- Node.js `^20.0.0` or higher
- npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/LowScarlet/lowscarlet-web.git
cd lowscarlet-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
DATABASE_URL=postgresql://user:password@endpoint/dbname?sslmode=require
ADMIN_PASSWORD=your_secure_admin_password
```

### 4. Database Setup

Push the database schema to your Neon PostgreSQL instance:

```bash
npx drizzle-kit push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Available Scripts

- `npm run dev` — Starts the local Next.js development server.
- `npm run build` — Builds the production application.
- `npm run start` — Starts the production Next.js server.
- `npm run lint` — Runs ESLint code quality checks.

---

## Author

**Tegar Maulana Fahreza (LowScarlet)**
- **Website**: [https://lowscarlet.my.id](https://lowscarlet.my.id)
- **GitHub**: [@LowScarlet](https://github.com/LowScarlet)

---

## License

This project is open source and available under the [MIT License](LICENSE).
