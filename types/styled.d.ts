// import original module declarations
import 'styled-components';

// const theme = {
//     colors: {
//         primary: '#0070f3'
//     },
//     constants: {
//         headerHeight: '64px'
//     }
// };

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string;
        };
        constants: {
            headerHeight: string;
        };
    }
}
