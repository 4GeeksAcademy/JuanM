import { BsDatabaseAdd } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			email:null,
			error: null,
			message: null,
			id:null
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
						process.env.BACKEND_URL + "/api/register",
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

					console.log("mensaje data", data)

					if(!response.ok) {
						return {
							success:false,
							message:data.msg || "Error en el registro",
						}
					}

					return {
						success: true,
						message: data.msg || "Usuario registrado exitosamente",
						token: data.token, 
						email: data.email 
						};
				}catch(error) {
					console.error("Error", error);
					return {
					success: false, 
					message: "Error de conexión: " + error.message
					};
				}
				},

loginUser: async (email, password,id) => {
  try {
	console.log("Enviando:", { email, password, id }); 
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
      localStorage.setItem("id", data.id); 
      
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


// changePassword: async (currentPassword, newPassword) => {
//   try {
//     const response = await fetch('/api/password', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}` // o tu método de autenticación
//       },
//       body: JSON.stringify({
//         currentPassword,
//         newPassword
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return { success: false, message: errorData.message };
//     }

//     return await response.json();
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// },


changePassword: async (currentPassword, newPassword) => {
  try {
    const response = await fetch('/api/password', {
      method: 'PUT', // Cambiado de POST a PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        current_password: currentPassword, // Cambiado a snake_case
        new_password: newPassword         // Cambiado a snake_case
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.error || errorData.message };
    }

    return { success: true, ...await response.json() };
  } catch (error) {
    console.error('Error en changePassword:', error);
    return { 
      success: false, 
      message: error.message || 'Error de conexión con el servidor'
    };
  }
},


deleteUser: async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        
        const url = `${process.env.BACKEND_URL}/api/${id}`; // Asegúrate que la ruta es correcta
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Failed to delete user");
        }

        return await response.json();
    } catch (error) {
        console.error("Delete user error:", error);
        throw error;
    }
},

logoutUser: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setStore({
          ...getStore(),
          token: null,
          email: null
        
        });
      },
      
		}
	};
};

export default getState;
