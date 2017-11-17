import { connect } from 'react-redux'
import { login } from '@/store/actions'
import Login from '@/component/Login'

const mapStateToProps = state => {
  return {
    loading: state.loading,
    isLogin: state.isLogin
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLogin: payload => {
      dispatch(login(payload))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
