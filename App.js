import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from "./src/routes/StackNav";
import { StepProvider } from './src/context/StepContext';
import { NotificationsProvider } from './src/context/NotificationContext';
import { ProductProvider } from './src/context/ProductContext';
import { UserProvider } from './src/context/UserContext';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([ // Ignorowanie ostrzeżenia dotyczącego defaultProps (ostrzeżenie o przyszłościowym nie wspieraniu tej metody)
    'TextElement: Support for defaultProps will be removed'
]);

function App() {
    return (
    <UserProvider>
     <ProductProvider>
      <StepProvider>
        <NotificationsProvider>
         <NavigationContainer>
            <StackNav/>
         </NavigationContainer>
        </NotificationsProvider>
       </StepProvider>
      </ProductProvider>
     </UserProvider>
    );
}

export default App;
