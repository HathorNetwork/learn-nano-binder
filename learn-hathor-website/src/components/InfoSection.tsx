import { AlertCircle, Clock, Users, Timer } from 'lucide-react';
import { Card, CardContent } from './ui';

interface LimitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function LimitItem({ icon, title, description }: LimitItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function InfoSection() {
  return (
    <section className="py-12 bg-bg-secondary/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-text-primary">
            Usage Guidelines & Limits
          </h2>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-6">
            <LimitItem
              icon={<Clock className="w-5 h-5" />}
              title="2 Builds Per Hour"
              description="You can launch up to 2 notebook builds per hour. This limit applies regardless of whether you shut down your servers — it's based on the total number of builds initiated within a one-hour window."
            />

            <div className="border-t border-white/10" />

            <LimitItem
              icon={<Timer className="w-5 h-5" />}
              title="Automatic Notebook Shutdown"
              description="Notebooks will automatically shut down after 15 minutes of inactivity to free up resources. Additionally, all notebooks have a maximum runtime of 1 hour regardless of activity."
            />

            <div className="border-t border-white/10" />

            <LimitItem
              icon={<Users className="w-5 h-5" />}
              title="Global Resource Limits"
              description="To ensure fair access for all users, there are global limits on the total number of concurrent notebooks. These limits are higher and unlikely to affect most users, but during peak usage times, you may need to wait for resources to become available."
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
