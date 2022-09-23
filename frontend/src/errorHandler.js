const errorCatching = (action, options, dispatch, setErrors) => {
  return dispatch(action(options))
          .catch(async (res) => {
            const data = await res.json();
            console.log(data)
            if (data && data.errors) setErrors(data.errors);
        });
};
export default errorCatching;
