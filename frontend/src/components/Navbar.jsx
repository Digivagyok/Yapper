import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Navbar(){
    

    return (
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/profile">Profile</Link></li>
        </ul>
    )
};