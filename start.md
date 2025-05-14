yacc -d proto.y
lex proto.l
gcc lex.yy.c y.tab.c -o prototype_validator

# Valid examples:

echo "int square(int x);" | ./prototype_validator
echo "void print();" | ./prototype_validator

# Invalid examples:

echo "int sum(int a, float);" | ./prototype_validator # Missing param name
echo "float compute()" | ./prototype_validator # Missing semicolon
