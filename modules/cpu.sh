cd cpu
sudo rmmod  cpu_201801597
make clean
make all
sudo insmod cpu_201801597.ko
cd ..