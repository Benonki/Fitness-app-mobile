import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from "./src/routes/StackNav/StackNav";
import { StepProvider } from './src/context/StepContext/StepContext';
import { NotificationsProvider } from './src/context/NotificationContext/NotificationContext';
import { ProductProvider } from './src/context/ProductContext/ProductContext';
import { UserProvider } from './src/context/UserContext/UserContext';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([ // Ignorowanie ostrzeżenia dotyczącego defaultProps (ostrzeżenie o przyszłościowym nie wspieraniu tej metody)
    'TextElement: Support for defaultProps will be removed'
]);

function App() {
    return (
    <UserProvider>
     <NotificationsProvider>
      <ProductProvider>
       <StepProvider>
         <NavigationContainer>
            <StackNav/>
         </NavigationContainer>
       </StepProvider>
      </ProductProvider>
     </NotificationsProvider>
    </UserProvider>
    );
}

export default App;
