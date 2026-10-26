import Tab from "./Tab";

export default function App() {
  return (
    <main>
      <Tab
        label="Account"
        defaultTab="profile"
        tabs={[
          {
            id: "profile",
            label: "Profile",
            content: <p>Update your display name and bio.</p>,
          },
          {
            id: "billing",
            label: "Billing",
            content: <p>Manage payment methods and invoices.</p>,
          },
          {
            id: "security",
            label: "Security",
            content: <p>Change password and review active sessions.</p>,
          },
        ]}
      />
    </main>
  );
}
