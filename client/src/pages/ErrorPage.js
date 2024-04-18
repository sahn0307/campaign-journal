import { useNavigate,} from 'react-router-dom'
import '../styles/ErrorPage.scss'

const ErrorPage = () => {
    const navigate = useNavigate()

    const handleGoBackAPage = () => {
        navigate(-1)
    }

    const handleGoToHome = () => {
        navigate('/')
    }

    return (
        <div className='err-wrapper'>
            <h1 className='err'>404: You've strayed too far from your Journey...</h1>
            <button onClick={handleGoBackAPage} className='err'>Get Back</button>
            <button onClick={handleGoToHome} className='err'>Return Home</button>
        </div>
    )
}

export default ErrorPage