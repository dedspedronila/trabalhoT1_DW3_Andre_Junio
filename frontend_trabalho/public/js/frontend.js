//rotina que verifica se o usuario que está logado, é autenticado, tem permissão para estar acessado
function dw3IsLogged() {

    //verifica se o Cookie IsLogged existe no navegador.
    const isLogged = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('IsLogged='));

    //se o cookie não for encontrado, usuario é desconectado e enviado para a tela de login
    if (!isLogged) {
        window.location.href = '/login';
        return false;
    }

    //se o cookie existir, o usuario é autenticado e pode continaur acessado
    return true;
}

//remover o cookie de controle de acesso do usuario ao fazer logout
function dw3ClearIsLoggedCookie() {

    //verifica se existe o cookie IsLogged
    var isLogged = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('IsLogged='));

    //se existir, ele é removido do navegador
    if (isLogged) {
        document.cookie = 'IsLogged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
}