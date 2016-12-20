package br.com.geopixel.model;

public class User {
    private String login;
    private String nome;
    private String senha;
    private String type;
    private String unity = "";
    private String unityAd = "";
    private boolean first = true;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getNome() {
            return nome;
    }

    public void setNome(String name) {
            this.nome = name;
    }
	
    public String getSenha() {
        return senha;
    }

    public void setSenha(String password) {
        this.senha = password;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUnity() {
        return unity;
    }

    public void setUnity(String unity) {
        this.unity = unity;
    }

    public String getUnityForUser() {
        if("manager".equals(getType())) {
            return getUnity();
        }
        return "";
    }

	public boolean isFirst() {
		return first;
	}

	public void setFirst(boolean first) {
		this.first = first;
	}

	public String getUnityAd() {
		return unityAd;
	}

	public void setUnityAd(String unityAd) {
		this.unityAd = unityAd;
	}
}
