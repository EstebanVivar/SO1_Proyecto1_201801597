cd memoria
sudo rmmod  memo_201801597
make clean
make all
sudo insmod memo_201801597.ko
cd ..