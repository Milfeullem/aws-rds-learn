Build a Data Fetching Dashboard in React that loads metrics from a mock API, shows shimmer placeholders while loading, and retries with exponential backoff on failures.

1. Dashboard Layout
   Render summary cards (Revenue, Active Users, Conversion Rate, Refunds)
   Render a recent activity list
   Display a "Last updated" timestamp when data loads successfully
2. Loading State (Shimmer)
   Show shimmer skeletons for cards and activity rows while loading
   Keep shimmer visible during retries until data loads
3. Error Handling with Exponential Backoff
   Retry failed requests automatically with exponential backoff
   Base delay: 500ms
   Retry attempts: max 4 total attempts
   Backoff formula: delay = baseDelay \* 2^attempt
   Show a retry status message while waiting for the next attempt
   Provide a "Retry now" button to restart immediately
4. Cancellation & Cleanup
   Cancel in-flight requests on unmount or when starting a new retry
   Clear timers when a retry is aborted or succeeds
   Data Shape

interface DashboardData {
summary: {
label: string;
value: string;
delta: string;
}[];
activity: {
id: string;
title: string;
time: string;
}[];
lastUpdated: string;
}
Example Mock Data

{
summary: [
{ label: 'Revenue', value: '$84.2k', delta: '+12%' },
{ label: 'Active Users', value: '3,412', delta: '+4%' }
],
activity: [
{ id: '1', title: 'Invoice #4821 paid', time: '2m ago' }
],
lastUpdated: '2024-06-04T12:05:00Z'
}
