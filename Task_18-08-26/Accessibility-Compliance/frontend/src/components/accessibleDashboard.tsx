import { useEffect,useRef,useState } from "react";

import { getAccessibilityPreferences, 
    updateAccessibilityPreferences,
} from "../api/accessibilityApi";

import type { AccessibilityPreferences } from "../types/accessibility.types";
import AccessibleModal from "./accessibleModal";
import LiveRegion from "./accessibility/LiveRegion";
import '../styles/accessibility.css';

interface User {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
}

const users: User[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Rahul Mehta",
    email: "rahul@example.com",
    status: "Active",
  },
];

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  reducedMotion: false,
  screenReaderAnnouncements: true,
};

const AccessibleDashboard = () => {
  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(
      defaultPreferences
    );

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [announcement, setAnnouncement] =
    useState("");

  const triggerRef =
    useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data =
          await getAccessibilityPreferences();

        setPreferences(data);
      } catch (error) {
        console.error(
          "Failed to load accessibility preferences:",
          error
        );

        setAnnouncement(
          "Unable to load accessibility preferences."
        );
      }
    };

    void loadPreferences();
  }, []);

  const updatePreference = async (
    key: keyof AccessibilityPreferences
  ) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    try {
      const saved =
        await updateAccessibilityPreferences(
          updatedPreferences
        );

      setPreferences(saved);

      const labelMap: Record<
        keyof AccessibilityPreferences,
        string
      > = {
        highContrast: "High contrast",
        reducedMotion: "Reduced motion",
        screenReaderAnnouncements:
          "Screen reader announcements",
      };

      setAnnouncement(
        `${labelMap[key]} ${
          saved[key] ? "enabled" : "disabled"
        }.`
      );
    } catch (error) {
      console.error(
        "Failed to update accessibility preference:",
        error
      );

      setAnnouncement(
        "Failed to update accessibility preference."
      );
    }
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);

    setAnnouncement(
      `User details opened for ${user.name}.`
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);

    setAnnouncement(
      "User details dialog closed."
    );
  };

  return (
    <section
      className={
        preferences.highContrast
          ? "dashboard high-contrast"
          : "dashboard"
      }
      aria-labelledby="dashboard-heading"
    >
      {preferences.screenReaderAnnouncements && (
        <LiveRegion message={announcement} />
      )}

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">
            Accessibility Compliance
          </p>

          <h1 id="dashboard-heading">
            Accessible User Dashboard
          </h1>

          <p>
            Manage users and accessibility
            preferences using keyboard and
            assistive technologies.
          </p>
        </div>
      </header>

      <section
        aria-labelledby="preferences-heading"
        className="preferences"
      >
        <h2 id="preferences-heading">
          Accessibility Preferences
        </h2>

        <div
          className="preference-list"
          role="group"
          aria-label="Accessibility preferences"
        >
          <button
            type="button"
            aria-pressed={
              preferences.highContrast
            }
            onClick={() =>
              void updatePreference(
                "highContrast"
              )
            }
          >
            High contrast:{" "}
            {preferences.highContrast
              ? "On"
              : "Off"}
          </button>

          <button
            type="button"
            aria-pressed={
              preferences.reducedMotion
            }
            onClick={() =>
              void updatePreference(
                "reducedMotion"
              )
            }
          >
            Reduced motion:{" "}
            {preferences.reducedMotion
              ? "On"
              : "Off"}
          </button>

          <button
            type="button"
            aria-pressed={
              preferences.screenReaderAnnouncements
            }
            onClick={() =>
              void updatePreference(
                "screenReaderAnnouncements"
              )
            }
          >
            Screen reader announcements:{" "}
            {preferences.screenReaderAnnouncements
              ? "On"
              : "Off"}
          </button>
        </div>
      </section>

      <section
        aria-labelledby="users-heading"
        className="users-section"
      >
        <div className="section-header">
          <div>
            <h2 id="users-heading">
              Users
            </h2>

            <p id="users-description">
              Use Tab to navigate the actions.
              Select a user to view details.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table
            aria-describedby="users-description"
          >
            <caption className="visually-hidden">
              User management table
            </caption>

            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="visually-hidden">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row">
                    {user.name}
                  </th>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`status status-${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      ref={
                        user.id === 1
                          ? triggerRef
                          : undefined
                      }
                      type="button"
                      onClick={() =>
                        openUserDetails(user)
                      }
                      aria-label={`View details for ${user.name}`}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AccessibleModal
        isOpen={isModalOpen}
        title={
          selectedUser
            ? `Details for ${selectedUser.name}`
            : "User details"
        }
        onClose={closeModal}
        triggerRef={triggerRef}
      >
        {selectedUser && (
          <div>
            <dl>
              <dt>Name</dt>
              <dd>{selectedUser.name}</dd>

              <dt>Email</dt>
              <dd>{selectedUser.email}</dd>

              <dt>Status</dt>
              <dd>{selectedUser.status}</dd>
            </dl>

            <button
              type="button"
              onClick={closeModal}
            >
              Done
            </button>
          </div>
        )}
      </AccessibleModal>
    </section>
  );
};

export default AccessibleDashboard;