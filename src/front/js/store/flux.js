const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			email:null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
//Registrar un nuevo usuario de la App
			registerUser:async(userData) =>{
				try {
					const response = await fetch(
						process.env.BACKEND_URL + "api/register",
						{
							method: "POST",
							headers:{
								"Content-type":"application/json"
							},
							body: JSON.stringify({
								email:userData.email,
								password:userData.password
							})
						}
					)

					const data = await response.json();
					if(response.ok) {
						return {
							success:true,
							message:"Usuario Registrado"
						}
					}else{
						return {
							success:false,
							message: data.msg || "Error en el registro",
						}
					}
				}catch(error){
					console.error("Error", error)
					return{success: false, message: "Error de conexión"}
				}
			},

loginUser: async (email, password) => {
  try {
	console.log("Enviando:", { email, password }); 
    let response = await fetch(process.env.BACKEND_URL + "api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,  
        password: password, 
      }),
    });

    // Si la respuesta está bien
    if (response.ok) {
      // Transformamos la respuesta a objeto JS
      let data = await response.json();
	  console.log("Datos recibidos", data)

	if(!data.email){
		console.error("El backend no devolvio email");
		return { success: false, message: "Datos incompletos del usuario" };
	}

      // Guardamos el token y la información del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email); 
      
    //   // Si el backend devuelve más información del usuario, la podemos guardar
    //   if (data.user) {
    //     localStorage.setItem("user", JSON.stringify(data.user));
    //   }

      // Actualizamos el store
      setStore({
        ...getStore(),
        token: data.token,
        email: data.email,
      });

      return {
        success: true,
        message:data.msg || "Login exitoso",
        email: data.email // Opcional: devolver información del usuario
      };
    } else {
      let data = await response.json();
      return {
        success: false,
        message: data.msg || "Error en el login",
      };
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return {
      success: false,
      message: "Error en la solicitud: " + error.message,
    };
  }
},
      
		}
	};
};

export default getState;
