# Example: Refactoring Analytics Pages

This document shows how to refactor an analytics page using the new templates and hooks.

## Before: Complex Analytics Page (100+ lines)

```tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useDateRange } from '../../components/DateRangeContext';
import { useRole } from '@/lib/components/Role/RoleContext';
import { isAdmin, isChannelPartner } from '@/lib/utils/utils';
import { callAdminAnalyticsBusinessTrends, callMerchantAnalyticsBusinessTrends } from '@/lib/hooks/use-analytics';
import { BusinessTrendsGraph } from './components/BusinessTrendsGraph';
import { BusinessTrendsTable } from './components/BusinessTrendsTable';
import BusinessTrendsSimmer from './components/BusinessTrendsSimmer';

const BusinessTrendsPage = () => {
  const { dateRange } = useDateRange();
  const { role } = useRole();
  const [error, setError] = useState<string | null>(null);
  const [businessTrends, setBusinessTrends] = useState(initialState);

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString();
  };

  const startDate = formatDateForAPI(dateRange.startDate);
  const endDate = formatDateForAPI(dateRange.endDate);

  // Complex role-based query logic
  const { data, isLoading, refetch } = (isAdmin(role) || isChannelPartner(role))
    ? callAdminAnalyticsBusinessTrends(role, startDate, endDate)
    : callMerchantAnalyticsBusinessTrends(startDate, endDate);

  useEffect(() => {
    refetch();
  }, [dateRange, refetch]);

  // Complex data extraction and error handling
  useEffect(() => {
    if (data) {
      const [trendsData, apiError] = data;

      if (apiError) {
        setError(apiError.message || 'Failed to fetch data');
        return;
      }

      if (trendsData) {
        // Complex data transformation...
        setBusinessTrends(transformedData);
      }
    }
  }, [data]);

  // Manual loading state
  if (isLoading) {
    return <BusinessTrendsSimmer />;
  }

  // Manual error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Manual empty state
  if (!businessTrends) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <BusinessTrendsGraph data={businessTrends} />
      <BusinessTrendsTable data={businessTrends} />
    </div>
  );
};

export default BusinessTrendsPage;
```

## After: Clean Analytics Page (30 lines)

```tsx
'use client';
import { useDateRange } from '../../components/DateRangeContext';
import { useBusinessTrends } from '@/lib/hooks/useAnalyticsData';
import { AnalyticsPageTemplate } from '@/lib/components';
import { BusinessTrendsGraph } from './components/BusinessTrendsGraph';
import { BusinessTrendsTable } from './components/BusinessTrendsTable';
import BusinessTrendsSimmer from './components/BusinessTrendsSimmer';

const BusinessTrendsPage = () => {
  const { dateRange } = useDateRange();

  const startDate = dateRange.startDate.toISOString();
  const endDate = dateRange.endDate.toISOString();

  const queryResult = useBusinessTrends(startDate, endDate);

  return (
    <AnalyticsPageTemplate
      queryResult={queryResult}
      loadingComponent={<BusinessTrendsSimmer />}
      renderContent={(data) => (
        <>
          <BusinessTrendsGraph data={data} />
          <BusinessTrendsTable data={data} />
        </>
      )}
      emptyState={{
        title: "No business trends data",
        description: "Try selecting a different date range"
      }}
    />
  );
};

export default BusinessTrendsPage;
```

## What Changed?

### ✅ Removed (70+ lines eliminated):
- ❌ Manual state management (`useState` for error, data)
- ❌ Complex role-based query logic
- ❌ Manual data extraction from tuple
- ❌ Manual error handling
- ❌ Manual loading state rendering
- ❌ Manual empty state rendering
- ❌ Two `useEffect` hooks
- ❌ Duplicate refetch logic

### ✅ Added (cleaner, simpler):
- ✅ `useBusinessTrends` hook (handles role automatically)
- ✅ `AnalyticsPageTemplate` (handles all states)
- ✅ Single `renderContent` function
- ✅ Declarative empty state config

### Benefits:
1. **70% less code** - From 100+ lines to 30 lines
2. **Consistent error handling** - Template handles it
3. **No role logic duplication** - Hook handles it
4. **Better user experience** - Consistent UI
5. **Easier to test** - Less logic in component
6. **Easier to maintain** - Less code = less bugs

---

## Step-by-Step Migration Guide

### Step 1: Replace Query Hook
```tsx
// BEFORE
const { role } = useRole();
const { data, isLoading } = (isAdmin(role) || isChannelPartner(role))
  ? callAdminAnalyticsBusinessTrends(role, startDate, endDate)
  : callMerchantAnalyticsBusinessTrends(startDate, endDate);

// AFTER
const queryResult = useBusinessTrends(startDate, endDate);
```

### Step 2: Remove State Management
```tsx
// REMOVE all of this
const [error, setError] = useState<string | null>(null);
const [businessTrends, setBusinessTrends] = useState(initialState);

useEffect(() => {
  if (data) {
    const [trendsData, apiError] = data;
    // ... complex logic
  }
}, [data]);
```

### Step 3: Remove Manual Renders
```tsx
// REMOVE all of this
if (isLoading) {
  return <BusinessTrendsSimmer />;
}

if (error) {
  return <div className="error">{error}</div>;
}

if (!businessTrends) {
  return <div>No data available</div>;
}
```

### Step 4: Wrap with Template
```tsx
// ADD this
return (
  <AnalyticsPageTemplate
    queryResult={queryResult}
    loadingComponent={<BusinessTrendsSimmer />}  // Optional
    renderContent={(data) => (
      <YourActualContent data={data} />
    )}
  />
);
```

---

## All Available Analytics Hooks

```tsx
import {
  useBusinessTrends,      // Business trends analytics
  useConversionRate,      // Conversion rate analytics
  usePaymentFailure,      // Payment failure analytics
  usePaymentSuccess,      // Payment success analytics
  useAnalyticsData,       // Generic analytics (with type)
} from '@/lib/hooks/useAnalyticsData';

// Usage examples:
const query1 = useBusinessTrends(startDate, endDate);
const query2 = useConversionRate(startDate, endDate);
const query3 = usePaymentFailure(startDate, endDate);
const query4 = usePaymentSuccess(startDate, endDate);

// Generic (if you need custom type)
const query5 = useAnalyticsData('business-trends', startDate, endDate);
```

---

## Common Patterns

### Pattern 1: Simple Analytics Page
```tsx
export default function MyAnalyticsPage() {
  const queryResult = useMyAnalytics(startDate, endDate);

  return (
    <SimpleAnalyticsPage queryResult={queryResult}>
      {(data) => <MyChart data={data} />}
    </SimpleAnalyticsPage>
  );
}
```

### Pattern 2: Analytics with Multiple Components
```tsx
export default function MyAnalyticsPage() {
  const queryResult = useMyAnalytics(startDate, endDate);

  return (
    <AnalyticsPageTemplate
      queryResult={queryResult}
      renderContent={(data) => (
        <>
          <MyChart data={data} />
          <MyTable data={data} />
          <MyStats data={data} />
        </>
      )}
    />
  );
}
```

### Pattern 3: Custom Loading/Error UI
```tsx
export default function MyAnalyticsPage() {
  const queryResult = useMyAnalytics(startDate, endDate);

  return (
    <AnalyticsPageTemplate
      queryResult={queryResult}
      loadingComponent={<CustomShimmer />}
      errorComponent={<CustomError />}
      renderContent={(data) => <MyContent data={data} />}
    />
  );
}
```

### Pattern 4: With Data Transformation
```tsx
export default function MyAnalyticsPage() {
  const [transformed, setTransformed] = useState(null);
  const queryResult = useMyAnalytics(startDate, endDate);

  return (
    <AnalyticsPageTemplate
      queryResult={queryResult}
      onDataChange={(data) => {
        if (data) {
          setTransformed(transformData(data));
        }
      }}
      renderContent={(data) => (
        <MyContent original={data} transformed={transformed} />
      )}
    />
  );
}
```

---

## Migration Checklist

For each analytics page:

- [ ] Replace role-based query logic with custom hook
- [ ] Remove manual state management (error, data)
- [ ] Remove data extraction `useEffect`
- [ ] Remove manual loading/error/empty renders
- [ ] Wrap with `AnalyticsPageTemplate`
- [ ] Test all states (loading, error, empty, success)
- [ ] Verify refetch works on date change
- [ ] Check role-based data (admin vs merchant)

---

**Result:** Analytics pages go from 100+ lines to 30-40 lines, with better error handling and consistent UI! 🎉
