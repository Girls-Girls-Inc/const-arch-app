'use client';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';



export default function SigninPage() {
//   const { setUser } = useUser();
//   const router = useRouter();
const navigate = useNavigate();

  return (
    <main>
      <h1>Sign In</h1>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse.credential);
          if (credentialResponse?.credential) {
            const decoded = jwtDecode(credentialResponse.credential);
            const fullName = decoded.name || '';
            const [name, surname] = fullName.split(' ');

            navigate('/')
          } else {
            console.error('No credential found');
          }
        }}
        onError={() => {
          console.log('Google sign-in failed');
        }}
      />

    
    </main>
  );
}