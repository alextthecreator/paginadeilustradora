import EventsCalendar from '@/components/EventsCalendar';

export default function CalendarPage() {
  return (
    <main className="calendar-page min-h-screen bg-brand-dark-teal text-brand-light-text">
      <div className="page-shell page-y calendar-page-shell w-full">
        <EventsCalendar />
      </div>
    </main>
  );
}
