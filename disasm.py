import sys
FILENAME = sys.argv[1]


def determineSize(myfile):
    count = 0
    with open(myfile, "rb") as f:
        byte = f.read(1)
        while byte:
            count+=1
            byte = f.read(1)
    return int((count/4))
def writeArrayToFile(arr):
    code = open("output.txt", "w")
    for j in arr:
        code.write(j)
    code.close()


#Any number that is supposed to be in twos complement can be converted with this little gadget here
def convertTwosComplement(num, leadOffset):
    if (num&(2**(leadOffset-1)))>>leadOffset-1==1: #check sign bit
        num=num|(-(2**(leadOffset-1))) #set all values to one before the section that is supposed to be twos complement
        return num
    return num
    
    
def rType(data, line):
    Rm = data&2031616
    Rm = Rm>>16
    Rn = data&992
    Rn = Rn>>5
    Rd = data&31
    codeArr[line]=codeArr[line]+"X"+str(Rd)+", X"+str(Rn)+", X"+str(Rm)
def iType(data, line):
    ALUImmediate = data&4193280
    ALUImmediate = ALUImmediate>>10
    ALUImmediate=convertTwosComplement(ALUImmediate, 12)
    Rn = data&992
    Rn = Rn>>5
    Rd = data&31
    codeArr[line]=codeArr[line]+"X"+str(Rd)+", X"+str(Rn)+", #"+str(ALUImmediate)
def dType(data, line):
    DTAddr = data&2093056
    DTAddr = DTAddr>>12
    DTAddr = convertTwosComplement(DTAddr, 9)
    Rn = data&992
    Rn = Rn>>5
    Rt = data&31
    codeArr[line]=codeArr[line]+"X"+str(Rt)+", [X"+str(Rn)+", #"+str(DTAddr)+"]"
def bType(data, line):
    BRaddress=data&67108863
    BRaddress = convertTwosComplement(BRaddress, 26)
    branchTarget= codeArr[line+BRaddress]
    if branchTarget[:5]!="label":
        codeArr[line]= codeArr[line]+"label"+str(line)
        codeArr[line+BRaddress]="label"+str(line)+": "+branchTarget
    else:
        codeArr[line] = codeArr[line]+ branchTarget.split(':')[0]

def cbType(data, line):
    BRaddress = data&16777184
    BRaddress = BRaddress>>5
    BRaddress = convertTwosComplement(BRaddress, 19)
    branchTarget = codeArr[line+BRaddress]
    if branchTarget[:5]!="label":
        codeArr[line]= codeArr[line]+"label"+str(line)
        codeArr[line+BRaddress]="label"+str(line)+": "+branchTarget
    else:
        codeArr[line] = codeArr[line]+ branchTarget.split(':')[0]

def main():
    i=0
    for j in range(determineSize(FILENAME)):
        codeArr.append("")
    data=binary.read(4)
    while data: 
        data = int.from_bytes(data, "big")
        opcode = data>>21
        #check if ADD
        if(opcode==1112):
            codeArr[i]=codeArr[i]+"ADD "
            rType(data, i) 
        #check if ADDI
        elif(opcode==1160):
            codeArr[i]=codeArr[i]+"ADDI "
            iType(data, i)
        #check if AND
        elif(opcode==1104):
            codeArr[i]=codeArr[i]+"AND "
            rType(data, i)
        #check if ANDI
        elif(opcode==1168):
            codeArr[i]=codeArr[i]+"ANDI "
            iType(data, i)
        #check if B
        elif(opcode>=160 and opcode<=191):
            codeArr[i]=codeArr[i]+"B "
            bType(data, i) 
        #check if B.
        elif(opcode>=672 and opcode<=679):
            Rt = data & 31 
            testCode = ""
            if Rt==0:
                testCode = "EQ "
            elif Rt==1:
                testCode = "NE "
            elif Rt==2:
                testCode = "HS "
            elif Rt==3:
                testCode = "LO "
            elif Rt==4:
                testCode = "MI "
            elif Rt==5:
                testCode = "PL "
            elif Rt==6:
                testCode = "VS "
            elif Rt==7:
                testCode = "VC "
            elif Rt==8:
                testCode = "HI "
            elif Rt==9:
                testCode = "LS "
            elif Rt==10:
                testCode = "GE "
            elif Rt==11:
                testCode = "LT "
            elif Rt==12:
                testCode = "GT "
            elif Rt==13:
                testCode = "LE "
                    
            codeArr[i]=codeArr[i]+"B."+testCode
            cbType(data, i) 
        #check if BL
        elif(opcode>=1184 and opcode<=1215):
            codeArr[i]=codeArr[i]+"BL "
            bType(data, i)
        #check if BR 
        elif(opcode==1712):
            Rn = data&992
            Rn = Rn>>5
            codeArr[i]=codeArr[i]+"BR "+str(Rn)
        #check if CBZ
        elif(opcode>=1440 and opcode<=1447):
            Rt = data&31
            codeArr[i]=codeArr[i]+"CBZ X"+str(Rt)+", "
            cbType(data, i)
        #check if CBNZ
        elif(opcode>=1448 and opcode<=1455):
            Rt = data&31
            codeArr[i]=codeArr[i]+"CBNZ X"+str(Rt)+", "
            cbType(data, i)
        #check if EOR
        elif(opcode==1616):
            codeArr[i]=codeArr[i]+"EOR "
            rType(data, i)
        #check if EORI
        elif(opcode==1680 or opcode==1681):
            codeArr[i]=codeArr[i]+"EORI "
            iType(data, i)
        #check if LDUR
        elif(opcode==1986):
            codeArr[i]=codeArr[i]+"LDUR "
            dType(data, i)
        #check if LSL
        elif(opcode==1691):
            Shamt = data&64512
            Shamt = Shamt>>10
            Rn = data&992
            Rn = Rn>>5
            Rd = data&31
            codeArr[i]=codeArr[i]+"LSL X"+str(Rd)+", X"+str(Rn)+", #"+str(Shamt)
        #check if LSR
        elif(opcode==1690):
            Shamt = data&64512
            Shamt = Shamt>>10
            Rn = data&992
            Rn = Rn>>5
            Rd = data&31
            codeArr[i]=codeArr[i]+"LSR X"+str(Rd)+", X"+str(Rn)+", #"+str(Shamt)
        #check if ORR
        elif(opcode==1360):
            codeArr[i]=codeArr[i]+"ORR "
            rType(data, i)
        #check if ORRI
        elif(opcode==1424 or opcode==1425):
            codeArr[i]=codeArr[i]+"ORRI "
            iType(data, i)
        #check if STUR
        elif(opcode==1984):
            codeArr[i]=codeArr[i]+"STUR "
            dType(data, i)
        #check if SUB
        elif(opcode==1624):
            codeArr[i]=codeArr[i]+"SUB "
            rType(data, i)
        #check if SUBI
        elif(opcode==1672 or opcode==1673):
            codeArr[i]=codeArr[i]+"SUBI "
            iType(data, i)
        #check if SUBIS
        elif(opcode==1928 or opcode==1929):
            codeArr[i]=codeArr[i]+"SUBIS "
            iType(data, i)
        #check if SUBS
        elif(opcode==1880):
            codeArr[i]=codeArr[i]+"SUBS "
            rType(data, i)
        #check if MUL
        elif(opcode==1240):
            codeArr[i]=codeArr[i]+"MUL "
            rType(data, i)
        #check if PRNT
        elif(opcode==2045):
            Rn = data&992
            Rn = Rn>>5
            codeArr[i]=codeArr[i]+"PRNT X"+str(Rn)
        #check if PRNL
        elif(opcode==2044):
            codeArr[i]=codeArr[i]+"PRNL"
        #check if DUMP
        elif(opcode==2046):
            codeArr[i]=codeArr[i]+"DUMP"
        #check if HALT
        elif(opcode==2047):
            codeArr[i]=codeArr[i]+"HALT"

        codeArr[i]=codeArr[i]+"\n"
        data=binary.read(4)
        i+=1
    
    writeArrayToFile(codeArr)

codeArr = []
binary = open(FILENAME, mode="rb")
main()
binary.close()