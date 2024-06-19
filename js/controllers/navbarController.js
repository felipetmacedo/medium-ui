myApp.controller("navbarController", [
  "$rootScope",
  "$scope",
  "UserService",
  "$state",
  function ($rootScope, $scope, UserService, $state) {
    $scope.isUserLoggedIn = $rootScope.userLogged;
    $scope.user = {
      email: "",
      password: "",
    };
    $scope.formData = {
      name: "",
      email: "",
      password: "",
    };

    const login = () => {
      UserService.login($scope.user)
        .then((resp) => {
          console.log(resp);
          localStorage.setItem("token", resp.data.data.token);
          localStorage.setItem("email", $scope.user.email);

          $scope.user.email = "";
          $scope.user.password = "";

          window.location.reload();
        })
        .catch((err) => {
          Swal.fire({
            title: "Algo deu errado",
            text:
              err.data && err.data.error === "Usuario bloqueado"
                ? err.data.error
                : "Verifique as suas informações!",
            icon: "error",
            confirmButtonColor: "#04052e",
          });
          localStorage.clear();
          $scope.user.password = "";
        });
    };

    const create = () => {
      return UserService.create($scope.formData)
        .then(() => {
          Swal.fire({
            title: "Conta criada com sucesso!",
            text: "Faça login para continuar!",
            icon: "success",
          });
          $scope.formData.name = "";
          $scope.formData.email = "";
          $scope.formData.password = "";
          $scope.formData.confirmPassword = "";
        })
        .catch(() => {
          Swal.fire({
            title: "Dados Inválidos!",
            text: "Verifique as suas informações!",
            icon: "error",
          });
          $scope.err = true;
          localStorage.clear();
          $scope.formData.username = "";
          $scope.formData.email = "";
          $scope.formData.password = "";
          $scope.formData.confirmPassword = "";
        });
    };

    const logOut = () => {
      Swal.fire({
        title: "Log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          $rootScope.userLogged = false;
          localStorage.clear();
          window.location.reload();
        }
      });
    };

    $scope.triggerLogin = async function () {
      const { value: formValues } = await Swal.fire({
        title: "Login",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Email">
          <input id="swal-input2" class="swal2-input" placeholder="Password">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
          ];
        },
      });
      if (formValues) {
        $scope.user.email = formValues[0];
        $scope.user.password = formValues[1];
        login();
      }
    };

    $scope.triggerRegister = async function () {
      const { value: formValues } = await Swal.fire({
        title: "Create Account",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Name">
          <input id="swal-input2" class="swal2-input" placeholder="Email">
          <input id="swal-input3" class="swal2-input" placeholder="Password">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
          ];
        },
      });
      if (formValues) {
        $scope.formData.name = formValues[0];
        $scope.formData.email = formValues[1];
        $scope.formData.password = formValues[2];
        create();
      }
    };
    $scope.logOut = logOut;
  },
]);
