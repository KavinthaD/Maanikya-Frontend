import React from 'react';
import { FormProvider } from './context/FormContext';
import YourNavigator from './YourNavigator'; // Import your navigator

const App = () => {
  return (
    <FormProvider>
      <YourNavigator />
    </FormProvider>
  );
};

export default App; 