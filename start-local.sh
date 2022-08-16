kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml
kubectl apply -k https://github.com/CrunchyData/postgres-operator-examples/kustomize/install/namespace
kubectl apply --server-side -k https://github.com/CrunchyData/postgres-operator-examples/kustomize/install/default
