kubectl create secret docker-registry registry-secret --docker-server=rg.fr-par.scw.cloud --docker-username=tongli --docker-password=$SCW_SECRET_KEY
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.9.1/cert-manager.yaml
