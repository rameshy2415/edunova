import React from "react";
import { PageHeader, Card } from "../../components/common";

/**
 * SettingsPage
 * TODO: Replace stub content with real UI.
 *
 * Example:
 *   const { data, loading, execute } = useApi(yourApi.getAll);
 *   useEffect(() => { execute(); }, []);
 */
export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Academic Year 2025–26"
      />
      <Card>
        <div className="py-12 text-center">
          <div className="text-4xl mb-3">🚧</div>
          <p className="font-serif text-lg text-ink/50">Settings</p>
          <p className="text-sm text-ink/35 mt-1">
            Connect to your backend via{" "}<code className="text-cobalt">useApi()</code>{" "}and build your UI here.
          </p>
        </div>
      </Card>
    </div>
  );
}
