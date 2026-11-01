Build an app where clicking Add appends a new progress bar.

Each added bar should:

start empty,
begin filling immediately,
finish in about 2000ms,
fill independently from other bars.
Use CSS transitions for animation (fire-and-forget behavior).

Constraints
Use React function components and hooks
Each click adds one new bar at the bottom
Each new bar starts animating immediately
Bars animate independently
Each animation takes approximately 2000ms

Clicking Add appends bars, but now bars must fill one at a time:

only one active bar at any time,
next bar starts only after previous finishes,
each bar still takes around 2000ms.

Now allow parallel animation with a cap:

up to 3 bars can animate at once,
extra bars wait,
when one active bar completes, the next waiting bar starts.
