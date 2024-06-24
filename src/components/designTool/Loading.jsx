import { ClipLoader } from 'react-spinners';
import PropTypes from 'prop-types';

const override = {
    display: 'block',
    margin: '0 auto',
    // marginTop: '220px',
    textAlign: 'center'
};

const Loading = ({ loading, text }) => {
    return (
        <div style={override}>
            <ClipLoader color="#36d7b7" size={40} loading={loading} />
            <div style={{
                padding: '20px',
                color: '#77AAAD',
                fontWeight: '600',
            }}>
                <h1>{text}</h1>
            </div>
        </div>
    );
};

Loading.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string
};

export default Loading;
